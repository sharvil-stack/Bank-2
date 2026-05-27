package org.project.bank2.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BankAccountResDTO {
    private Long id;
    private String accountNumber;
    private BigDecimal balance;
    private String status;
    private LocalDateTime createdAt;
}
