package org.project.bank2.controller;

import org.project.bank2.dto.ai.AiChatRequestDTO;
import org.project.bank2.dto.ai.AiChatResponseDTO;
import org.project.bank2.dto.ai.AiInsightResponseDTO;
import org.project.bank2.service.AiAssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/ai")
public class AiController {

    @Autowired
    private AiAssistantService aiAssistantService;

    @GetMapping("/insights")
    public AiInsightResponseDTO  getInsight() {
        String insight = aiAssistantService.generateInsight();
        return new AiInsightResponseDTO(insight, LocalDateTime.now());
    }
    @PostMapping("/ask")
    public AiChatResponseDTO ask(@RequestBody AiChatRequestDTO aiChatRequestDTO) {
        String answer= aiAssistantService.answerQuestion(aiChatRequestDTO);
        return new AiChatResponseDTO(answer);
    }
}
