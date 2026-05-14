# RepoLens

RepoLens is a full-stack app for analyzing GitHub repositories. The idea is simple: paste a public GitHub repository URL and get a readable overview of the project, its stack, its quality signals, and a few suggestions that could help improve it.

I built it with a **Next.js frontend**, a **Spring Boot backend**, and **PostgreSQL**. The deployment target is intentionally simple: **Vercel** for the frontend, **Render** for the backend, and **Neon** for the database.

## What the app does

- Analyzes a public GitHub repository from its URL.
- Shows repository metadata, languages, branches, contributors, README information, detected technologies, and quality signals.
- Calculates a repository score based on practical indicators such as documentation, tests, Docker files, CI/CD files, license, and project structure.
- Generates recommendations that can help make a repository easier to understand or more presentable.
- Compares two or three repositories.
- Saves analysis history and report snapshots for logged-in users.
- Generates Markdown and PDF-style recruiter reports.
- Allows sharing saved reports through public links.
- Supports scheduled repository checks and optional score-drop notifications.

This is still a portfolio/project app, not a production auditing tool. The scores and recommendations are useful as guidance, but they should not be treated as absolute judgments about a repository.

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript, MUI |
| Backend | Spring Boot, Spring Security, Spring Data JPA |
| Database | PostgreSQL / Neon |
| Authentication | JWT |
| API docs | Swagger / OpenAPI |
| Local setup | Docker Compose |
| Deployment | Vercel, Render, Neon |

## Project structure

```txt
.
├── backend/              # Spring Boot API
├── frontend/             # Next.js frontend
├── docs/                 # API and deployment notes
├── docker-compose.yml    # Local development setup
├── render.yaml           # Render backend deployment config
└── README.md
```

## Running locally

### 1. Clone the project

```bash
git clone https://github.com/yskalli01/repolens.git
cd repolens
```

### 2. Create environment files

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Then update the values that are specific to your machine, especially database credentials, `JWT_SECRET`, and `GITHUB_TOKEN`.

### 3. Start everything with Docker Compose

```bash
docker compose up --build
```

Useful local URLs:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend | `http://localhost:8080` |
| Health check | `http://localhost:8080/api/health` |
| Swagger UI | `http://localhost:8080/swagger-ui/index.html` |

## Running without Docker

Backend:

```bash
cd backend
./mvnw spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Environment variables

The examples are included in:

```txt
.env.example
backend/.env.example
frontend/.env.example
```

Main frontend variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Main backend variables:

```env
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8080
DATABASE_URL=jdbc:postgresql://localhost:5432/github_analyzer
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
FRONTEND_URL=http://localhost:3000
GITHUB_TOKEN=your_github_token
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRATION_MS=86400000
GITHUB_CACHE_TTL_SECONDS=300
```

For Neon, the database URL should use JDBC format:

```txt
jdbc:postgresql://HOST:5432/DATABASE?sslmode=require
```

## Tests and checks

Backend:

```bash
cd backend
./mvnw test
```

Frontend:

```bash
cd frontend
npm ci
npm run lint
npm run typecheck
npm run build
npm run test
```

Some frontend/backend checks may need small fixes depending on the current development branch. Run them before pushing changes to GitHub.

## API documentation

When the backend is running, Swagger is available here:

```txt
http://localhost:8080/swagger-ui/index.html
```

There is also a written API overview in:

```txt
docs/API.md
```

## Deployment

The intended deployment setup is:

| Layer | Platform |
| --- | --- |
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |


## Notes

This project is still evolving and some parts may change as I continue improving the analysis system and UI.

The current focus is:
- improving repository analysis accuracy
- making the reports cleaner
- optimizing GitHub API usage
- improving the frontend experience
