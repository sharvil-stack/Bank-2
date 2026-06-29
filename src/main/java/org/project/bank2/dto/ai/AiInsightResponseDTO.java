package org.project.bank2.dto.ai;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AiInsightResponseDTO {
    private String insight;
    private LocalDateTime generatedAt;
}

