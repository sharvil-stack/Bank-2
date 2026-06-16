package org.project.bank2.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    private static final String MODEL = "gemini-2.0-flash";

    public String getCompletion(String prompt) {

        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/"
                        + MODEL
                        + ":generateContent?key="
                        + apiKey;

        GeminiRequest requestBody = new GeminiRequest(prompt);

        GeminiResponse response = restClient.post()
                .uri(url)
                .header("Content-Type", "application/json")
                .body(requestBody)
                .retrieve()
                .body(GeminiResponse.class);

        if (response == null
                || response.getCandidates() == null
                || response.getCandidates().isEmpty()) {

            throw new RuntimeException("Gemini API returned empty response");
        }

        return response.getCandidates()
                .get(0)
                .getContent()
                .getParts()
                .get(0)
                .getText();
    }
}