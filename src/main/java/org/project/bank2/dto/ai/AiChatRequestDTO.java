package org.project.bank2.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiChatRequestDTO {

    private String question;
    private List<AiChatTurnDTO> history;
}
