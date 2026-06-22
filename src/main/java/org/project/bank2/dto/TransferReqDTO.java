package org.project.bank2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferReqDTO {
    @NotBlank(message = "Cannot be left blanked")
    private String fromAccount;
    @NotBlank(message = "Cannot be left blanked")
    private String toAccount;
    @NotNull
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;
    private String description;
}
