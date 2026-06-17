package org.project.bank2.service;

import org.project.bank2.ai.GeminiRequest;
import org.project.bank2.dto.ai.AiChatRequestDTO;
import org.project.bank2.dto.ai.AiChatTurnDTO;
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

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

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
