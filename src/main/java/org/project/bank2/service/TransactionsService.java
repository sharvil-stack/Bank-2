package org.project.bank2.service;

import jakarta.transaction.Transactional;

import org.project.bank2.dto.TransactionResDTO;
import org.project.bank2.enums.TransactionType;
import org.project.bank2.exception.BadRequestException;
import org.project.bank2.exception.ResourceNotFoundException;
import org.project.bank2.model.BankAccount;
import org.project.bank2.model.Transactions;
import org.project.bank2.repo.BankAccountRepo;
import org.project.bank2.repo.TransactionRepo;
import org.springframework.beans.factory.annotation.Autowired;
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

    public TransactionResDTO deposit(
            String accountNumber,
            BigDecimal amount) {

       if(amount.compareTo(BigDecimal.ZERO) <= 0) {
           throw new BadRequestException("Amount must be greater than zero!");
       }
         BankAccount bankAccount = bankAccountRepo.findByAccountNumber(accountNumber).orElseThrow(()-> new IllegalArgumentException("Account number not found"));

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
            BigDecimal amount) {
        BankAccount bankAccount = bankAccountRepo.findByAccountNumber(accountNumber).orElseThrow(()-> new IllegalArgumentException("Account number not found"));
        if(bankAccount.getBalance().compareTo(amount) < 0) {
            throw new  BadRequestException("Amount must be greater than zero!");
        }

            BankAccount bAccount = bankAccountRepo.findByAccountNumber(accountNumber).orElseThrow(()-> new IllegalArgumentException("Account number not found"));
            bankAccount.setBalance(bAccount.getBalance().subtract(amount));
            bankAccountRepo.save(bAccount);

            Transactions transactions = new Transactions();
            transactions.setAccount(bAccount);
            transactions.setAmount(amount);
            transactions.setType(TransactionType.WITHDRAW);
            transactions.setCreatedAt(LocalDateTime.now());
            transactions.setDescription("Cash Withdrawal");
        Transactions savedTransaction =
                transactionRepo.save(transactions);

        return mapToResponse(savedTransaction);
    }

    @Transactional
    public void transfer(String fromAccountNumber, String toAccountNumber, BigDecimal amount) {
        if(amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be greater than zero!");
        }

        if(fromAccountNumber.equals(toAccountNumber)) {
            throw new IllegalArgumentException("From account number cannot be the same as to account number");
        }

        BankAccount sender = bankAccountRepo
                .findByAccountNumber(fromAccountNumber).orElseThrow(()-> new IllegalArgumentException("Account number not found"));
        BankAccount reciever = bankAccountRepo
                .findByAccountNumber(toAccountNumber).orElseThrow(()-> new IllegalArgumentException("Account number not found"));

        if(sender.getBalance().compareTo(amount) < 0)
            throw new BadRequestException("Insufficient balance!");

        sender.setBalance(sender.getBalance().subtract(amount));
        bankAccountRepo.save(sender);
        reciever.setBalance(reciever.getBalance().add(amount));
        bankAccountRepo.save(reciever);

        Transactions transactions = new Transactions();
        transactions.setAccount(sender);
        transactions.setAmount(amount);
        transactions.setType(TransactionType.TRANSFER_OUT);
        transactions.setCreatedAt(LocalDateTime.now());
        transactions.setDescription("Transfer to " + reciever.getAccountNumber());
         transactionRepo.save(transactions);

        Transactions transactions2 = new Transactions();
        transactions2.setAccount(reciever);
        transactions2.setAmount(amount);
        transactions2.setType(TransactionType.TRANSFER_IN);
        transactions2.setCreatedAt(LocalDateTime.now());
        transactions2.setDescription("Transferred from " + sender.getAccountNumber());
        transactionRepo.save(transactions2);

    }

    public List<TransactionResDTO> getTransactions(
            String accountNumber) {
        return transactionRepo
                .findByAccountAccountNumber(accountNumber)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<TransactionResDTO> getRecentTransactions(String accountNumber) {

        if(!bankAccountRepo.existsByAccountNumber(accountNumber))
            throw new RuntimeException("Account not found");

        return transactionRepo
                .findTop10ByAccountAccountNumberOrderByCreatedAtDesc(accountNumber)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<TransactionResDTO> getStatement(String AccountNumber, LocalDateTime from, LocalDateTime to) {
        if(!bankAccountRepo.existsByAccountNumber(AccountNumber))
            throw new ResourceNotFoundException("Account number not found");

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

        return dto;
    }

}
