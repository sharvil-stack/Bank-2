package org.project.bank2.controller;


import org.project.bank2.model.Transactions;
import org.project.bank2.service.TransactionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionsController {


    @Autowired
    private TransactionsService transactionsService;

    @PostMapping("/deposit")
    public ResponseEntity<Transactions> deposit(@RequestParam String accountNumber, @RequestParam BigDecimal amount){
        return  ResponseEntity.ok(transactionsService.deposit(accountNumber, amount));
    }
    @PostMapping("/withdraw")
    public ResponseEntity<Transactions> withdraw(@RequestParam String accountNumber, @RequestParam BigDecimal amount){
        return ResponseEntity.ok(transactionsService.withdraw(accountNumber, amount));
    }
    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(@RequestParam String fromAccount, @RequestParam String toAccount, @RequestParam BigDecimal amount){
        transactionsService.transfer(fromAccount, toAccount, amount);
        return ResponseEntity.ok("Transfer successful");
    }
    @GetMapping("/{accountNumber}")
    public ResponseEntity<List<Transactions>> getAllTransactions(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                transactionsService.getTransactions(accountNumber)
        );
    }

    @GetMapping("/{accountNumber}/recent")
    public ResponseEntity<List<Transactions>> getRecentTransactions(@PathVariable String accountNumber){
        return ResponseEntity.ok(transactionsService.getRecentTransactions(accountNumber));
    }
    @GetMapping("/{accountNumber}/statement")
    public ResponseEntity<List<Transactions>> getStatement(@PathVariable String accountNumber, @RequestParam LocalDateTime from, @RequestParam LocalDateTime to){
        return ResponseEntity.ok(transactionsService.getStatement(accountNumber,from,to));
    }


}
