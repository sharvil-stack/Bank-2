package org.project.bank2.controller;

import org.project.bank2.dto.BankAccountResDTO;
import org.project.bank2.service.BankAccountService;
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
    public ResponseEntity<BankAccountResDTO> createBankAccount(@RequestBody BankAccountResDTO dto){

        return ResponseEntity.ok(bankAccountService.createBankAccount(dto));
    }
    @GetMapping("/{accountNumber}")
    public ResponseEntity<BankAccountResDTO> getAccount(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                bankAccountService.getBankAccountByNumber(accountNumber)
        );
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<BankAccountResDTO> getAccountById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bankAccountService.getBankAccountById(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<BankAccountResDTO>> getAllAccounts() {

        return ResponseEntity.ok(
                bankAccountService.getAllBankAccounts()
        );
    }


    @PutMapping("/{accountNumber}/activate")
    public ResponseEntity<BankAccountResDTO> activateAccount(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                bankAccountService.activateAccount(accountNumber)
        );
    }

    @PutMapping("/{accountNumber}/close")
    public ResponseEntity<BankAccountResDTO> closeAccount(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                bankAccountService.closeAccount(accountNumber)
        );
    }

    @GetMapping("/{accountNumber}/exists")
    public ResponseEntity<Boolean> exists(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                bankAccountService.existsByAccountNumber(accountNumber)
        );
    }
}

