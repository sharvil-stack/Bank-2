package org.project.bank2.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.Transaction;
import org.project.bank2.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "transactions")
@NoArgsConstructor
@Data
@AllArgsConstructor
public class Transactions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private TransactionType type;
    private String description;
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name = "account_id")
    private BankAccount account;


}
