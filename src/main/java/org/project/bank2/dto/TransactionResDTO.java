package org.project.bank2.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionResDTO {
    private Long id;
    private BigDecimal amount;
    private String type;
    private String description;
    private LocalDateTime createdAt;
}
