# TalentOS Backend

A talent acquisition and recruitment platform backend built with **ASP.NET Core (.NET 10)**, **Clean Architecture**, **CQRS (MediatR)**, **Entity Framework Core**, and **PostgreSQL**.

---

## Solution Structure

```
TalentOS/
├── src/
│   ├── TalentOS.Domain/           # Entities, Enums, Value Objects, Interfaces, Exceptions
│   ├── TalentOS.Application/      # CQRS Features (Commands, Queries, Handlers, DTOs, Validators)
│   ├── TalentOS.Infrastructure/   # EF Core DbContext, Repositories, Services
│   └── TalentOS.API/              # Controllers, Middleware, Program.cs
└── Tests/
```

## Prerequisites

- .NET 10 SDK
- PostgreSQL 15+

## Getting Started

### 1. Configure the database connection

Edit `src/TalentOS.API/appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=TalentOS;Username=postgres;Password=<your_password>"
  }
}
```

### 2. Set a strong JWT secret key
In `appsettings.Development.json` set `JwtSettings:Secret` to at least 32 characters.

### 3. Run EF Core migrations

```bash
cd src/TalentOS.API
dotnet ef migrations add InitialCreate --project ../TalentOS.Infrastructure
dotnet ef database update --project ../TalentOS.Infrastructure
```

### 4. Run the API

```bash
dotnet run --project src/TalentOS.API
```

API runs at: http://localhost:5269  
OpenAPI UI (Scalar): http://localhost:5269/scalar/v1

---

## API Endpoints Overview

| Controller       | Route prefix             | Key operations                                   |
|------------------|--------------------------|--------------------------------------------------|
| Auth             | `/api/auth`              | register, login, refresh, logout, me             |
| Applicants       | `/api/applicants`        | get profile, update profile, get skills          |
| Recruiters       | `/api/recruiters`        | get profile, update profile                      |
| Jobs             | `/api/jobs`              | CRUD, publish, close, search, my-jobs            |
| Applications     | `/api/applications`      | apply, get, my-applications, update-status, withdraw |
| Verification     | `/api/verification`      | submit, get, pending, approve, reject            |
| Documents        | `/api/documents`         | upload, get, get-by-applicant, delete            |
| Notifications    | `/api/notifications`     | get, history, mark-read                          |
| Interviews       | `/api/interviews`        | schedule, get, update, cancel, my-interviews     |
| AI               | `/api/ai`                | analyze-resume, match-candidate                  |

---

## Key Technology Decisions

| Concern          | Choice                                        |
|------------------|-----------------------------------------------|
| Architecture     | Clean Architecture (Domain → Application → Infrastructure → API) |
| CQRS             | MediatR 12.5.0 — each use case is one handler |
| Validation       | FluentValidation 12.1.1 via pipeline behaviour |
| ORM              | EF Core 10.0 + Npgsql 10.0 (PostgreSQL)       |
| Mapping          | Mapster 10.0.0                                |
| Auth             | JWT Bearer (System.IdentityModel.Tokens.Jwt 8.9.0) |
| Password hashing | BCrypt.Net-Next 4.0.3                         |
| Logging          | Serilog 9.0.0 (Console + rolling File sink)   |
| API docs         | OpenAPI via Scalar 2.16.18                    |

---

## Replacing Stub Services

- **EmailService** (`Infrastructure/Services/EmailService.cs`) → integrate SendGrid / Mailgun / SMTP
- **LocalFileStorageService** → integrate Azure Blob Storage, AWS S3, or Google Cloud Storage
- **StubAiService** → integrate OpenAI, Azure OpenAI, or a custom ML endpoint

