# RepoLens

RepoLens is a modern GitHub repository analysis dashboard built with **Next.js**, **React**, **Material UI**, and a backend API. It helps developers inspect repository quality, understand technology usage, compare projects, and generate recruiter-ready reports.

The project is designed as a portfolio-grade full-stack application: clean UI, authenticated workflows, repository analytics, PDF reporting, saved history, and deployment-ready configuration.

## Features

- **Repository analysis** from a GitHub repository URL
- **Project health scoring** with quality signals and complexity indicators
- **Language distribution** and repository analytics visualizations
- **Repository comparison** and comparison history
- **Contributor, branch, README, technology, and metrics cards**
- **PDF report generation and shared report pages**
- **Authentication flow** for login and registration
- **Analysis history** with delete confirmation
- **Notification settings** for score-drop alerts
- **Responsive Material UI dashboard** with light/dark theme support
- **RepoLens branding** with a custom SVG app icon

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js App Router, React, TypeScript |
| UI | Material UI, MUI Icons, Emotion |
| Styling | MUI `sx` prop, responsive layout patterns |
| Testing | Vitest |
| Quality | ESLint, TypeScript type checking |
| Deployment target | Vercel |
| API target | Spring Boot / REST API |

## Project Structure

```txt
frontend/
├── src/
│   ├── app/                 # Next.js routes and layouts
│   ├── components/          # Reusable UI and dashboard components
│   ├── context/             # Authentication context
│   ├── services/            # API clients
│   ├── types/               # TypeScript domain models
│   └── utils/               # Shared utilities
├── public/                  # Static assets
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A running backend API, by default on `http://localhost:8080`

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Then update it if your backend runs somewhere else:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

```bash
npm run dev        # Start the development server
npm run build      # Create a production build
npm run start      # Start the production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript checks
npm run test       # Run Vitest tests
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the backend REST API |

## Deployment

### Frontend on Vercel

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Set the project root to `frontend` if this repository also contains backend code.
4. Add `NEXT_PUBLIC_API_URL` in Vercel project settings.
5. Deploy.

### Backend target

RepoLens is prepared to consume a REST API. For a typical portfolio deployment:

- Deploy the Spring Boot API on Render.
- Use Neon PostgreSQL for the database.
- Set `NEXT_PUBLIC_API_URL` in Vercel to the Render API URL.

## GitHub Push Checklist

Before pushing publicly, run:

```bash
npm run lint
npm run typecheck
npm run build
```

Also check that these files are not committed:

- `.env.local`
- `.next/`
- `node_modules/`
- `*.tsbuildinfo`

## Suggested Repository Description

> RepoLens is a full-stack GitHub repository analysis platform that evaluates repository health, technology usage, complexity, and contributor activity with a modern Next.js + Material UI dashboard.

## Suggested GitHub Topics

```txt
nextjs react typescript material-ui github analytics dashboard portfolio spring-boot vercel
```

## Roadmap

- Add CI checks with GitHub Actions
- Add unit tests for URL validation and service helpers
- Add dashboard screenshots to this README
- Add OpenGraph preview images for shared reports
- Improve accessibility checks across visual analytics cards
- Add end-to-end tests for the repository analysis flow

## License

This project is currently private/proprietary. Add a license before making it open source.
