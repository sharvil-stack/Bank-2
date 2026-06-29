package org.project.bank2.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class SpendingSummaryDTO {
    private Map<String,Double> categories;
}
