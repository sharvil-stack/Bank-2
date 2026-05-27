package org.project.bank2.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ErrorResponseDTO {
    private String message;
    private int HttpStatus;
    private LocalDateTime timestamp;
}
