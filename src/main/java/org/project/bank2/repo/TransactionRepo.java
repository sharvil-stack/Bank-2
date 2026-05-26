package org.project.bank2.repo;



import org.project.bank2.model.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepo extends JpaRepository<Transactions, Long> {
    List<Transactions> findByAccountAccountNumber(String accountNumber);

    List<Transactions> findTop10ByAccountAccountNumberOrderByCreatedAtDesc(String accountNumber);

    List<Transactions>
    findByAccountAccountNumberAndCreatedAtBetween(
            String accountNumber,
            LocalDateTime start,
            LocalDateTime end
    );
}
