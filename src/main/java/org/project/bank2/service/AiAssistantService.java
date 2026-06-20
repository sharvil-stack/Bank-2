package org.project.bank2.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.project.bank2.ai.GeminiRequest;
import org.project.bank2.dto.ai.AiChatRequestDTO;
import org.project.bank2.dto.ai.AiChatTurnDTO;
import org.project.bank2.enums.TransactionType;
import org.project.bank2.model.BankAccount;
import org.project.bank2.model.Transactions;
import org.project.bank2.repo.BankAccountRepo;
import org.project.bank2.repo.TransactionRepo;
import org.project.bank2.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.project.bank2.model.User;
import org.springframework.stereotype.Service;
import org.project.bank2.dto.ai.SpendingSummaryDTO;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AiAssistantService {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private BankAccountRepo bankAccountRepo;

    @Autowired
    private TransactionRepo transactionRepo;

    @Autowired
    private GeminiService geminiService;

    private static final DateTimeFormatter DATE_FMT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");

    private static final String BASE_RULES = """
            You are the in-app financial assistant for Bank2, a banking application.
            You are speaking directly to the account holder described below.
 
            Rules you must always follow:
            - Only use the account and transaction data given to you in this message. Never invent numbers, dates, or merchant names.
            - You are not a licensed financial advisor. Never give investment, tax, or legal advice. You may point out spending patterns and general, non-regulated budgeting observations only.
            - Reply in plain conversational text - no markdown, no tables, no headings, no code blocks. This is rendered as plain text in a small panel.
            - If the data below is not enough to answer something, say so honestly instead of guessing.
            """;

    public String generateInsight(){
        User user = getCurrentUser();
        String context = buildFinancialContext(user);

        String systemPrompt = BASE_RULES + "\n" + context + """
 
                Task: using ONLY the data above, write a short personalized financial insight (3-5 sentences).
                Mention one concrete observation about their balances or recent transactions, and end with one practical, non-advisory suggestion.
                Address them by first name. Do not ask a question back.
                """;

        return geminiService.getCompletion(systemPrompt, "Generate my insight now.");

    }

    private String buildFinancialContext(User user) {

        List<BankAccount> accounts = bankAccountRepo.findByUserId(user.getId());

        StringBuilder sb = new StringBuilder();
        sb.append("Account holder: ")
                .append(user.getFirstName())
                .append(" ")
                .append(user.getLastName())
                .append("\n");

        if (accounts.isEmpty()) {
            sb.append("They have no bank accounts yet.\n");
            return sb.toString();
        }

        sb.append("Accounts:\n");

        for (BankAccount account : accounts) {

            sb.append("- Account ")
                    .append(maskAccountNumber(account.getAccountNumber()))
                    .append(" | status: ").append(account.getStatus())
                    .append(" | balance: ").append(account.getBalance())
                    .append("\n");

            List<Transactions> recent = transactionRepo
                    .findTop10ByAccountAccountNumberOrderByCreatedAtDesc(account.getAccountNumber());

            if (recent.isEmpty()) {
                sb.append("  No transactions yet.\n");
                continue;
            }

            sb.append("  Recent transactions:\n");

            for (Transactions tx : recent) {
                sb.append("    ")
                        .append(tx.getCreatedAt() != null ? tx.getCreatedAt().format(DATE_FMT) : "unknown date")
                        .append(" | ").append(tx.getType())
                        .append(" | ").append(tx.getAmount())
                        .append(" | ").append(tx.getDescription() == null ? "" : tx.getDescription())
                        .append("\n");
            }
        }

        return sb.toString();
    }
    public String answerQuestion(AiChatRequestDTO request) {

        User user = getCurrentUser();
        String context = buildFinancialContext(user);

        String systemPrompt = BASE_RULES + "\n" + context + """
 
                Task: the account holder is chatting with you about their finances.
                Answer their latest message using only the data above and the conversation so far.
                If they ask about something unrelated to their banking data, gently steer them back to their account.
                """;

        List<GeminiRequest.Content> conversation = new ArrayList<>();

        if (request.getHistory() != null) {
            for (AiChatTurnDTO turn : request.getHistory()) {
                conversation.add(new GeminiRequest.Content(
                        turn.getRole(),
                        List.of(new GeminiRequest.Part(turn.getText()))
                ));
            }
        }

        conversation.add(new GeminiRequest.Content(
                "user",
                List.of(new GeminiRequest.Part(request.getQuestion()))
        ));

        return geminiService.getCompletion(systemPrompt, conversation);
    }

    private static final List<String> SPENDING_CATEGORIES = List.of(
            "Food", "Shopping", "Education", "Transport", "Entertainment", "Healthcare", "Other"
    );

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    public SpendingSummaryDTO getSpendingSummary() {

        User user = getCurrentUser();
        List<BankAccount> accounts = bankAccountRepo.findByUserId(user.getId());

        List<Transactions> spendingTransactions = accounts.stream()
                .flatMap(account -> transactionRepo
                        .findByAccountAccountNumber(account.getAccountNumber())
                        .stream())
                .filter(tx -> tx.getType() == TransactionType.WITHDRAW
                        || tx.getType() == TransactionType.TRANSFER_OUT)
                .collect(Collectors.toList());

        Map<String, Double> emptyResult = SPENDING_CATEGORIES.stream()
                .collect(Collectors.toMap(c -> c, c -> 0.0, (a, b) -> a, LinkedHashMap::new));

        if (spendingTransactions.isEmpty()) {
            return new SpendingSummaryDTO(emptyResult);
        }

        StringBuilder txList = new StringBuilder();
        for (Transactions tx : spendingTransactions) {
            txList.append("- amount: ").append(tx.getAmount())
                    .append(", description: \"")
                    .append(tx.getDescription() == null ? "" : tx.getDescription())
                    .append("\"\n");
        }

        String systemPrompt = """
                You are a transaction categorization engine for Bank2, a banking application.
                You will be given a list of spending transactions (withdrawals and outgoing transfers), each with an amount and a free-text description.
 
                Categorize each transaction into exactly one of these categories: %s
 
                Use the description to infer the most likely category. If a description is empty, generic, or does not clearly match any category, place it under "Other".
 
                Sum the amounts per category and respond with ONLY a single valid JSON object, no markdown, no code fences, no explanation, in this exact shape:
                {"Food": 0, "Shopping": 0, "Education": 0, "Transport": 0, "Entertainment": 0, "Healthcare": 0, "Other": 0}
 
                Every category key listed above must be present in the JSON, using 0 for categories with no matching transactions.
                """.formatted(String.join(", ", SPENDING_CATEGORIES));

        String userPrompt = "Here are the transactions to categorize:\n" + txList;

        String raw = geminiService.getCompletion(systemPrompt, userPrompt);
        String cleaned = raw.trim()
                .replaceAll("^```json", "")
                .replaceAll("^```", "")
                .replaceAll("```$", "")
                .trim();

        try {
            Map<String, Double> parsed = OBJECT_MAPPER.readValue(
                    cleaned, new TypeReference<Map<String, Double>>() {});

            Map<String, Double> result = new LinkedHashMap<>(emptyResult);
            for (String category : SPENDING_CATEGORIES) {
                if (parsed.containsKey(category) && parsed.get(category) != null) {
                    result.put(category, parsed.get(category));
                }
            }
            return new SpendingSummaryDTO(result);

        } catch (Exception e) {
            return new SpendingSummaryDTO(emptyResult);
        }
    }

    private String maskAccountNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) {
            return accountNumber;
        }
        return "****" + accountNumber.substring(accountNumber.length() - 4);
    }
    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
