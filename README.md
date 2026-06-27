<div align="center">

# 🏦 Finova — AI-Powered Banking Application

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4-green?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-blue?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql)
![Gemini](https://img.shields.io/badge/Gemini_API-AI-purple?style=for-the-badge&logo=google)
![JWT](https://img.shields.io/badge/JWT-Auth-black?style=for-the-badge&logo=jsonwebtokens)

A full-stack banking platform with **JWT-secured REST APIs**, multi-account transaction management, and **Google Gemini AI** integration for real-time spending categorization and a conversational financial assistant.

[Features](#features) • [Tech Stack](#tech-stack) • [Architecture](#architecture) • [Getting Started](#getting-started) • [API Docs](#api-docs)

</div>

---

## Features

### 👤 User Portal
- Multi-account management (create, view, activate/close accounts)
- Deposits, withdrawals, and peer-to-peer transfers with balance validation
- Full transaction history with date-range filtering
- **AI-powered spending breakdown** — transactions auto-categorized at write time (Food, Transport, Shopping, etc.)
- **Conversational AI financial assistant** — multi-turn chat with context injection (balances, recent transactions, masked account numbers)

### 🛡️ Admin Portal
- View and manage all users and accounts
- Activate or close any account
- Full transaction visibility across all users
- Role-based access — admin routes protected separately from user routes

### 🔐 Security
- Stateless JWT authentication with custom `JwtAuthFilter`
- BCrypt password hashing
- Role-based access control (USER / ADMIN) enforced at route level via Spring Security

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 4, Spring Security, JPA/Hibernate |
| Frontend | React, Vite, Axios |
| Database | PostgreSQL |
| AI | Google Gemini API (via Spring `RestClient`) |
| Auth | JWT, BCrypt |
| Docs | Swagger / OpenAPI (SpringDoc 2.5) |
| Build | Maven |

---

## Architecture

```
finova/
├── src/
│   └── main/java/org/project/bank2/
│       ├── config/          # Security config, CORS, beans
│       ├── controller/      # REST controllers (Auth, Account, Transaction, AI)
│       ├── service/         # Business logic + Gemini integration
│       ├── model/           # JPA entities
│       ├── dto/             # Request/Response DTOs
│       ├── repo/            # Spring Data JPA repositories
│       ├── security/        # JwtAuthFilter, JwtService
│       └── exception/       # GlobalExceptionHandler
└── frontend/
    └── src/
        ├── pages/           # Dashboard, Login, Register, Admin
        └── components/      # AiAssistant, SpendingSummary, TransactionList
```

### AI Integration Flow
```
New Transaction
      │
      ▼
TransactionService.save()
      │
      ▼
GeminiService.categorize(description, note)
      │  Gemini API call with Indian context examples
      ▼
category persisted to DB (e.g. "Food", "Transport")
      │
      ▼
SpendingSummary reads category directly from DTO
```

---

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL
- Google Gemini API key 

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/sharvil-stack/finova.git
cd finova

# Configure environment
# Edit src/main/resources/application.properties:
# spring.datasource.url=jdbc:postgresql://localhost:5432/finova
# spring.datasource.username=your_username
# spring.datasource.password=your_password
# gemini.api.key=your_gemini_api_key

# Run
./mvnw spring-boot:run
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:8080`.

### Default Admin Setup
Since JWT contains no role claim, assign admin role manually after registering:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

---

## API Docs

Once the backend is running, visit:
```
http://localhost:8080/swagger-ui.html
```

Key endpoint groups:
- `POST /auth/register` — register new user
- `POST /auth/login` — get JWT token
- `GET /account/my-accounts` — fetch user's accounts
- `POST /transaction/deposit` — deposit funds
- `POST /transaction/transfer` — peer-to-peer transfer
- `GET /transaction/all/{accountId}` — full transaction history
- `POST /ai/chat` — conversational AI assistant
- `GET /admin/users` — all users (ADMIN only)

---

## Screenshots

> Coming soon — deployment in progress

---

## License

MIT License — feel free to use this as a reference for your own projects.

---

<div align="center">
Built by <a href="https://github.com/sharvil-stack">Sharvil Bhangre</a>
</div>
