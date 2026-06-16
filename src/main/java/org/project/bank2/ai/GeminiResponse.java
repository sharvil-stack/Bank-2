package org.project.bank2.ai;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class GeminiResponse {
    private List<ContentBlock> content;

    @Data
    @NoArgsConstructor
    public static class ContentBlock {
        private String type;
        private String text;
    }


    public String getFirstText() {
        if (content == null || content.isEmpty()) {
            return "";
        }
        return content.get(0).getText();
    }
}
