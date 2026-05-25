package org.project.bank2.repo;

import org.project.bank2.model.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BankAccountRepo extends JpaRepository<BankAccount, Long> {
    Optional<BankAccount> findbyAccountNumber( String accountNumber);
}
