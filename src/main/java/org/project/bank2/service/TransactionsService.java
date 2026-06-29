package org.project.bank2.service;

import jakarta.transaction.Transactional;

import org.project.bank2.dto.TransactionResDTO;
import org.project.bank2.enums.Status;
import org.project.bank2.enums.TransactionType;
import org.project.bank2.exception.BadRequestException;
import org.project.bank2.exception.ResourceNotFoundException;
import org.project.bank2.model.BankAccount;
import org.project.bank2.model.Transactions;
import org.project.bank2.model.User;
import org.project.bank2.repo.BankAccountRepo;
import org.project.bank2.repo.TransactionRepo;
import org.project.bank2.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionsService {

    @Autowired
    private BankAccountRepo bankAccountRepo;

    @Autowired
    private TransactionRepo transactionRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private GeminiService geminiService;

    public TransactionResDTO deposit(
            String accountNumber,
            BigDecimal amount) {

       if(amount.compareTo(BigDecimal.ZERO) <= 0) {
           throw new BadRequestException("Amount must be greater than zero!");
       }
        BankAccount bankAccount =
                getOwnedAccount(accountNumber);

       validateAccountActive(bankAccount);
         bankAccount.setBalance(bankAccount.getBalance().add(amount));
         bankAccountRepo.save(bankAccount);

         Transactions transactions = new Transactions();
         transactions.setAccount(bankAccount);
         transactions.setAmount(amount);
         transactions.setType(TransactionType.DEPOSIT);
         transactions.setCreatedAt(LocalDateTime.now());
         transactions.setDescription("Cash Deposit");

        Transactions savedTransaction =
                transactionRepo.save(transactions);

        return mapToResponse(savedTransaction);


    }

    public TransactionResDTO withdraw(
            String accountNumber,
            BigDecimal amount, String description) {
        BankAccount bankAccount = getOwnedAccount(accountNumber);
        validateAccountActive(bankAccount);
        if(bankAccount.getBalance().compareTo(amount) < 0) {
            throw new  BadRequestException("Insufficient Balance!");
        }
        if(amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException(
                    "Amount must be greater than zero!"
            );
        }

        bankAccount.setBalance(
                bankAccount.getBalance().subtract(amount)
        );

        bankAccountRepo.save(bankAccount);

        Transactions transactions = new Transactions();
            transactions.setAccount(bankAccount);
            transactions.setAmount(amount);
            transactions.setType(TransactionType.WITHDRAW);
            transactions.setCreatedAt(LocalDateTime.now());
        transactions.setDescription(description);

        String category =
                geminiService.classifyTransaction(description);

        transactions.setCategory(category);
            Transactions savedTransaction =
                transactionRepo.save(transactions);

        return mapToResponse(savedTransaction);
    }

    @Transactional
    public void transfer(String fromAccountNumber, String toAccountNumber, BigDecimal amount, String description) {
        if(amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be greater than zero!");
        }

        if(fromAccountNumber.equals(toAccountNumber)) {
            throw new IllegalArgumentException("From account number cannot be the same as to account number");
        }

        BankAccount sender = getOwnedAccount(fromAccountNumber);
        BankAccount reciever = bankAccountRepo
                .findByAccountNumber(toAccountNumber).orElseThrow(()-> new IllegalArgumentException("Account number not found"));

        if(sender.getBalance().compareTo(amount) < 0)
            throw new BadRequestException("Insufficient balance!");

        validateAccountActive(sender);
        validateAccountActive(reciever);


        sender.setBalance(sender.getBalance().subtract(amount));
        bankAccountRepo.save(sender);
        reciever.setBalance(reciever.getBalance().add(amount));
        bankAccountRepo.save(reciever);

        Transactions transactions = new Transactions();
        transactions.setAccount(sender);
        transactions.setAmount(amount);
        transactions.setType(TransactionType.TRANSFER_OUT);
        transactions.setCreatedAt(LocalDateTime.now());
        transactions.setDescription(description);

        String category =
                geminiService.classifyTransaction(description);

        transactions.setCategory(category);

        transactionRepo.save(transactions);

        Transactions transactions2 = new Transactions();
        transactions2.setAccount(reciever);
        transactions2.setAmount(amount);
        transactions2.setType(TransactionType.TRANSFER_IN);
        transactions2.setCreatedAt(LocalDateTime.now());
        transactions2.setDescription(
                "Transferred from " + sender.getAccountNumber()
        );

        transactions2.setCategory("Other");

        transactionRepo.save(transactions2);

    }

    public List<TransactionResDTO> getTransactions(
            String accountNumber) {

        BankAccount account =
                getOwnedAccount(accountNumber);

        return transactionRepo
                .findByAccountAccountNumber(
                        account.getAccountNumber()
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<TransactionResDTO> getRecentTransactions(String accountNumber) {

        BankAccount account =
                getOwnedAccount(accountNumber);


        return transactionRepo
                .findTop10ByAccountAccountNumberOrderByCreatedAtDesc(accountNumber)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<TransactionResDTO> getStatement(String AccountNumber, LocalDateTime from, LocalDateTime to) {
        BankAccount account =
                getOwnedAccount(AccountNumber);

        return transactionRepo
                .findByAccountAccountNumberAndCreatedAtBetween(
                        AccountNumber,
                        from,
                        to
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TransactionResDTO getTransactionById(Long transactionId) {

        Transactions transaction = transactionRepo.findById(transactionId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Transaction not found"));
        User currentUser = getCurrentUser();

        if (!transaction.getAccount()
                .getUser()
                .getId()
                .equals(currentUser.getId())) {

            throw new RuntimeException(
                    "You are not allowed to perform this operation");
        }

        return mapToResponse(transaction);    }

    private TransactionResDTO mapToResponse(Transactions transaction) {

        TransactionResDTO dto = new TransactionResDTO();

        dto.setId(transaction.getId());
        dto.setAccountNumber(
                transaction.getAccount().getAccountNumber()
        );
        dto.setAmount(transaction.getAmount());
        dto.setType(transaction.getType().name());
        dto.setDescription(transaction.getDescription());
        dto.setCreatedAt(transaction.getCreatedAt());
        dto.setCategory(transaction.getCategory());

        return dto;
    }
    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    private BankAccount getOwnedAccount(String accountNumber) {

        User currentUser = getCurrentUser();

        BankAccount account =
                bankAccountRepo.findByAccountNumber(accountNumber)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Account not found"));
        if (currentUser.getRole().equals("ADMIN")) {
            return account;
        }

        if (!account.getUser()
                .getId()
                .equals(currentUser.getId())) {

            throw new RuntimeException(
                    "You are not allowed to access this account");
        }

        return account;
    }

    private void validateAccountActive(BankAccount account) {
        if(account.getStatus() == Status.CLOSED) {
            throw new BadRequestException("Account is closed");
        }
    }

}
