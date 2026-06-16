package org.project.bank2.ai;

import io.swagger.v3.oas.annotations.media.Content;
import jakarta.servlet.http.Part;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeminiRequest {

    private List<Content> contents;

    public GeminiRequest(String prompt) {
        this.contents = List.of(
                new Content(
                        List.of(new Part(prompt))
                )
        );
    }

    public List<Content> getContents() {
        return contents;
    }

    public void setContents(List<Content> contents) {
        this.contents = contents;
    }
}