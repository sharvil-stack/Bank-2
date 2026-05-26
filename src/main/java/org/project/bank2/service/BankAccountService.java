package org.project.bank2.service;

import org.project.bank2.enums.Status;
import org.project.bank2.model.BankAccount;
import org.project.bank2.model.User;
import org.project.bank2.repo.BankAccountRepo;
import org.project.bank2.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BankAccountService {

    @Autowired
    private BankAccountRepo bankAccountRepo;
    @Autowired
    private UserRepo userRepo;

    public BankAccount getBankAccountById(Long id)
    {
        return bankAccountRepo.findById(id).orElseThrow(()-> new RuntimeException("Account Not Found"));
    }
    public BankAccount getBankAccountByNumber(String accountNumber)
    {
        return bankAccountRepo.findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));
    }

    public BankAccount createBankAccount(Long userId) {
       User user = userRepo.findById(userId).orElseThrow(()-> new RuntimeException("User Not Found"));
       BankAccount bankAccount = new BankAccount();
       bankAccount.setUser(user);
       bankAccount.setAccountNumber(generateAccountNumber());
       bankAccount.setBalance(BigDecimal.ZERO);
       bankAccount.setStatus(Status.ACTIVE);
       bankAccount.setCreatedAt(LocalDateTime.now());

       return bankAccountRepo.save(bankAccount);
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

    public BankAccount activateAccount(String accountNumber) {
        BankAccount bankAccount = getBankAccountByNumber(accountNumber);
        bankAccount.setStatus(Status.ACTIVE);

        return bankAccountRepo.save(bankAccount);
    }

    public BankAccount closeAccount(String accountNumber) {
        BankAccount bankAccount = getBankAccountByNumber(accountNumber);
        bankAccount.setStatus(Status.CLOSED);
        return bankAccountRepo.save(bankAccount);
    }

    public List<BankAccount> getAllBankAccounts() {
        return bankAccountRepo.findAll();
    }

}
