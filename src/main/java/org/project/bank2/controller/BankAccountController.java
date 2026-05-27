package org.project.bank2.controller;

import org.project.bank2.model.BankAccount;
import org.project.bank2.service.BankAccountService;
import org.project.bank2.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
public class BankAccountController {
    @Autowired
    private BankAccountService bankAccountService;

    @PostMapping("/create/{userId}")
    public ResponseEntity<BankAccount> createBankAccount(@PathVariable Long userId){

        return ResponseEntity.ok(bankAccountService.createBankAccount(userId));
    }
    @GetMapping("/{accountNumber}")
    public ResponseEntity<BankAccount> getAccount(@PathVariable String accountNumber){
        return ResponseEntity.ok(bankAccountService.getBankAccountByNumber(accountNumber));
    }
    @GetMapping("/id/{id}")
    public ResponseEntity<BankAccount> getAccountById(@PathVariable Long id){
        return ResponseEntity.ok(bankAccountService.getBankAccountById(id));
    }
    @GetMapping
    public ResponseEntity<List<BankAccount>> getAllBankAccounts(){
        return ResponseEntity.ok(bankAccountService.getAllBankAccounts());
    }

    @PutMapping("/{accountNumber}/activate")
    public ResponseEntity<BankAccount> activateBankAccount(@PathVariable String accountNumber){
        return ResponseEntity.ok(bankAccountService.activateAccount(accountNumber));
    }

    @PutMapping("/{accountNumber}/close")
    public ResponseEntity<BankAccount> closeBankAccount(@PathVariable String accountNumber){
        return ResponseEntity.ok(bankAccountService.closeAccount(accountNumber));
    }

    @GetMapping("/{accountNumber}/exists")
    public ResponseEntity<Boolean> exists(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                bankAccountService.existsByAccountNumber(accountNumber)
        );
    }
}

