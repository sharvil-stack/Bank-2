package org.project.bank2.service;

import org.project.bank2.ai.GeminiRequest;
import org.project.bank2.ai.GeminiResponse;
import org.project.bank2.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;


    @Value("${gemini.api.model:gemini-2.5-flash}")
    private String model;

    private final RestClient restClient = RestClient.create();

    private static final String BASE_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/";


    public String getCompletion(String systemPrompt, String userPrompt) {
        GeminiRequest.Content userTurn = new GeminiRequest.Content(
                "user",
                List.of(new GeminiRequest.Part(userPrompt))
        );

        return callGemini(systemPrompt, List.of(userTurn));
    }


    public String getCompletion(String systemPrompt, List<GeminiRequest.Content> conversation) {
        return callGemini(systemPrompt, conversation);
    }

    public String classifyTransaction(String description) {

        String prompt = """
            Categorize this transaction into EXACTLY ONE category:

            Food
            Shopping
            Education
            Transport
            Entertainment
            Healthcare
            Other

            Examples:

            Swiggy Order -> Food
            Zomato Dinner -> Food
            Uber Ride -> Transport
            Ola Ride -> Transport
            Amazon Purchase -> Shopping
            Netflix Subscription -> Entertainment
            Apollo Pharmacy -> Healthcare
            Coursera Course -> Education

            Transaction:
            """ + description + """

            Return only the category name.
            """;

        return getCompletion("", prompt).trim();
    }

    private String callGemini(String systemPrompt, List<GeminiRequest.Content> contents) {

        String url = BASE_URL + model + ":generateContent";

        GeminiRequest.Content systemInstruction = systemPrompt == null
                ? null
                : new GeminiRequest.Content(null, List.of(new GeminiRequest.Part(systemPrompt)));

        GeminiRequest requestBody = new GeminiRequest(contents, systemInstruction);

        GeminiResponse response;

        try {
            response = restClient.post()
                    .uri(url)
                    .header("Content-Type", "application/json")
                    .header("x-goog-api-key", apiKey)
                    .body(requestBody)
                    .retrieve()
                    .body(GeminiResponse.class);
        } catch (RestClientException ex) {
             ex.printStackTrace();
            throw new BadRequestException(
                    "The AI assistant is temporarily unavailable. Please try again shortly."
            );
        }

        String text = response == null ? null : response.getFirstText();

        if (text == null) {
            throw new BadRequestException(
                    "The AI assistant couldn't generate a response. Please try again."
            );
        }

        return text;
    }
}