package org.project.bank2.controller;


import jakarta.validation.Valid;
import org.project.bank2.dto.TransactionReqDTO;
import org.project.bank2.dto.TransactionResDTO;
import org.project.bank2.dto.TransferReqDTO;
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
    public ResponseEntity<TransactionResDTO> deposit(
            @Valid @RequestBody TransactionReqDTO dto) {

        return ResponseEntity.ok(
                transactionsService.deposit(
                        dto.getAccountNumber(),
                        dto.getAmount()
                )
        );
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResDTO> withdraw(
            @Valid @RequestBody TransactionReqDTO dto) {

        return ResponseEntity.ok(
                transactionsService.withdraw(
                        dto.getAccountNumber(),
                        dto.getAmount()
                )
        );
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(
            @Valid @RequestBody TransferReqDTO dto) {

        transactionsService.transfer(
                dto.getFromAccount(),
                dto.getToAccount(),
                dto.getAmount()
        );

        return ResponseEntity.ok("Transfer successful");
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<List<TransactionResDTO>>
    getAllTransactions(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                transactionsService.getTransactions(accountNumber)
        );
    }

    @GetMapping("/{accountNumber}/recent")
    public ResponseEntity<List<TransactionResDTO>>
    getRecentTransactions(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                transactionsService.getRecentTransactions(accountNumber)
        );
    }

    @GetMapping("/{accountNumber}/statement")
    public ResponseEntity<List<TransactionResDTO>>
    getStatement(
            @PathVariable String accountNumber,
            @RequestParam LocalDateTime from,
            @RequestParam LocalDateTime to) {

        return ResponseEntity.ok(
                transactionsService.getStatement(
                        accountNumber,
                        from,
                        to
                )
        );
    }
}
