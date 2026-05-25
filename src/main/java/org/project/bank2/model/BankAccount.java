package org.project.bank2.model;


import java.util.List;
import jakarta.persistence.*;
import lombok.*;
import org.project.bank2.enums.Status;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bank_accounts")
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private String accountNumber;
    private BigDecimal balance;

    @Enumerated(EnumType.STRING)
    private Status Status;

    private LocalDateTime createdAt;
    @OneToMany(mappedBy = "account")
    private List<Transactions> transactions;

}
