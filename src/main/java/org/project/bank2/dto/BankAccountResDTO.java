package org.project.bank2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BankAccountResDTO {
    private Long userId;
    private String accountNumber;
    private BigDecimal balance;
    private String status;
    private LocalDateTime createdAt;

}
