package org.project.bank2.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferReqDTO {
    private String fromAccount;
    private String toAccount;
    private BigDecimal amount;
}
