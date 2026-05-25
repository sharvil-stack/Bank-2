package org.project.bank2.repo;

import jakarta.transaction.Transaction;
import org.project.bank2.model.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepo extends JpaRepository<Transaction, Long> {
    List<Transactions> findByAccountNumber(String accountNumber);
}
