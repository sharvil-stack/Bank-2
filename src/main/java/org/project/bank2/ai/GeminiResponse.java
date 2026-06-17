package org.project.bank2.ai;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class GeminiResponse {

    private List<Candidate> candidates;

    @Data
    @NoArgsConstructor
    public static class Candidate {
        private GeminiRequest.Content content;
        private String finishReason;
    }


    public String getFirstText() {
        if (candidates == null || candidates.isEmpty()) {
            return null;
        }

        GeminiRequest.Content content = candidates.get(0).getContent();

        if (content == null || content.getParts() == null || content.getParts().isEmpty()) {
            return null;
        }

        return content.getParts().get(0).getText();
    }
}