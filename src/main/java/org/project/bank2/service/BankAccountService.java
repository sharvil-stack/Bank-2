package org.project.bank2.service;

import org.project.bank2.dto.BankAccountResDTO;
import org.project.bank2.enums.Status;
import org.project.bank2.exception.ResourceNotFoundException;
import org.project.bank2.model.BankAccount;
import org.project.bank2.model.User;
import org.project.bank2.repo.BankAccountRepo;
import org.project.bank2.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BankAccountService {

    @Autowired
    private BankAccountRepo bankAccountRepo;
    @Autowired
    private UserRepo userRepo;

    public BankAccountResDTO getBankAccountById(Long id) {

        BankAccount bankAccount = bankAccountRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bank Account with id: " + id + " not found!"));

        return mapToResponse(bankAccount);
    }
    public BankAccountResDTO getBankAccountByNumber(String accountNumber) {

        BankAccount bankAccount = bankAccountRepo
                .findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Bank Account with id: " + accountNumber + " not found!"));

        return mapToResponse(bankAccount);
    }

    public BankAccountResDTO createBankAccount(BankAccountResDTO dto) {
       User user = userRepo.findById(dto.getId()).orElseThrow(()-> new RuntimeException("User Not Found"));
       BankAccount bankAccount = new BankAccount();
       bankAccount.setUser(user);
       bankAccount.setAccountNumber(generateAccountNumber());
       bankAccount.setBalance(BigDecimal.ZERO);
       bankAccount.setStatus(Status.ACTIVE);
       bankAccount.setCreatedAt(LocalDateTime.now());

       BankAccount savedBankAccount = bankAccountRepo.save(bankAccount);
       return mapToResponse(savedBankAccount);
    }

    private String generateAccountNumber() {

        String accountNumber;

        do {
            accountNumber =
                    String.valueOf(
                            (long)(1000000000L +
                                    Math.random() * 9000000000L)
                    );
        }
        while(bankAccountRepo.existsByAccountNumber(accountNumber));

        return accountNumber;
    }

    public boolean existsByAccountNumber(String accountNumber) {
        return bankAccountRepo.existsByAccountNumber(accountNumber);
    }

    public BankAccountResDTO activateAccount(String accountNumber) {

        BankAccount bankAccount = bankAccountRepo
                .findByAccountNumber(accountNumber)
                        .orElseThrow(() -> new ResourceNotFoundException("Bank Account with id: " + accountNumber + " not found!"));

        bankAccount.setStatus(Status.ACTIVE);

        return mapToResponse(bankAccountRepo.save(bankAccount));
    }

    public BankAccountResDTO closeAccount(String accountNumber) {

        BankAccount bankAccount = bankAccountRepo
                .findByAccountNumber(accountNumber)
                        .orElseThrow(() -> new ResourceNotFoundException("Bank Account with id: " + accountNumber + " not found!"));
        bankAccount.setStatus(Status.CLOSED);

        return mapToResponse(bankAccountRepo.save(bankAccount));
    }

    public List<BankAccountResDTO> getAllBankAccounts() {

        return bankAccountRepo.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private BankAccountResDTO mapToResponse(BankAccount bankAccount) {

        BankAccountResDTO dto = new BankAccountResDTO();

        dto.setId(bankAccount.getId());
        dto.setAccountNumber(bankAccount.getAccountNumber());
        dto.setBalance(bankAccount.getBalance());
        dto.setStatus(bankAccount.getStatus().name());
        dto.setCreatedAt(bankAccount.getCreatedAt());

        return dto;
    }
}
