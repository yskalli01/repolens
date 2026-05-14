# RepoLens API notes

This file gives a practical overview of the backend API used by the frontend. It is not meant to replace Swagger. When in doubt, run the backend and check the generated OpenAPI docs.

Swagger URLs:

```txt
http://localhost:8080/swagger-ui/index.html
http://localhost:8080/v3/api-docs
```

Local base URL:

```txt
http://localhost:8080
```

Production base URL will be the Render backend URL, for example:

```txt
https://your-render-service.onrender.com
```

## Authentication

The app uses JWT authentication. Endpoints related to user history, saved reports, comparisons, and scheduled checks need a token.

```http
Authorization: Bearer <token>
```

You get the token from the login endpoint.

## Health

```http
GET /api/health
```

Used for local checks and Render health checks.

## Auth endpoints

### Register

```http
POST /api/auth/register
```

Example body:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

### Login

```http
POST /api/auth/login
```

Example body:

```json
{
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

The response contains the JWT used by protected endpoints.

### Current user

```http
GET /api/auth/me
```

Requires authentication.

## Repository analysis

### Basic analysis

```http
POST /api/repositories/analyze
```

Requires authentication.

```json
{
  "repositoryUrl": "https://github.com/vercel/next.js"
}
```

This stores an analysis item for the logged-in user.

### Full analysis

```http
POST /api/repositories/analyze/full
```

Requires authentication.

```json
{
  "repositoryUrl": "https://github.com/vercel/next.js"
}
```

The full analysis combines the main repository metadata with extra checks such as languages, contributors, branches, README information, technologies, quality signals, complexity, score, and recommendations.

### Public repository endpoints

These endpoints are useful when the frontend needs one part of the analysis separately:

```http
GET /api/repositories/{owner}/{repo}/score
GET /api/repositories/{owner}/{repo}/languages
GET /api/repositories/{owner}/{repo}/contributors
GET /api/repositories/{owner}/{repo}/branches
GET /api/repositories/{owner}/{repo}/readme
GET /api/repositories/{owner}/{repo}/technologies
GET /api/repositories/{owner}/{repo}/quality-signals
GET /api/repositories/{owner}/{repo}/complexity
GET /api/repositories/{owner}/{repo}/recommendations
```

Example:

```http
GET /api/repositories/vercel/next.js/score
```

## History

### Get analysis history

```http
GET /api/repositories/history
```

Requires authentication.

### Delete history item

```http
DELETE /api/repositories/history/{id}
```

Requires authentication.

## Repository comparison

### Compare repositories

```http
POST /api/repositories/compare
```

Requires authentication.

```json
{
  "repositoryUrls": [
    "https://github.com/vercel/next.js",
    "https://github.com/spring-projects/spring-boot"
  ]
}
```

The comparison endpoint is meant for two or three repositories. It returns a ranked comparison and stores a snapshot for the user.

### Comparison history

```http
GET /api/repositories/compare/history
```

Requires authentication.

## Reports

### Generate report

```http
GET /api/repositories/{owner}/{repo}/report
```

Returns a repository report object and Markdown-style content.

### Download PDF report

```http
GET /api/repositories/{owner}/{repo}/report.pdf
```

Returns a PDF response.

### Save report snapshot

```http
POST /api/repositories/{owner}/{repo}/report/save
```

Requires authentication.

### Saved reports

```http
GET /api/repositories/reports/saved
DELETE /api/repositories/reports/saved/{id}
```

Requires authentication.

### Share a saved report

```http
POST /api/repositories/reports/saved/{id}/share
```

Requires authentication.

### Public shared report

```http
GET /api/repositories/reports/shared/{shareId}
GET /api/repositories/reports/shared/{shareId}/report.pdf
```

These endpoints are public so a recruiter or reviewer can open the shared report.

### Report trends

```http
GET /api/repositories/reports/saved/trends?repositoryFullName=owner/repo
```

Requires authentication.

Used to show score changes across saved report snapshots.

## Scheduled repositories

Scheduled checks are used to re-analyze selected repositories from time to time.

```http
GET /api/scheduled-repositories
POST /api/scheduled-repositories
DELETE /api/scheduled-repositories/{id}
POST /api/scheduled-repositories/{id}/run
```

These endpoints require authentication.

Notification preferences are handled through:

```http
GET /api/notification-preferences
PUT /api/notification-preferences
```

## GitHub token and rate limits

The backend can call GitHub without a token, but the rate limits are low. For a better experience, set:

```env
GITHUB_TOKEN=your_token_here
```

The token does not need broad permissions if you are only analyzing public repositories.

## Common errors

A typical error response looks like this:

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Repository not found"
}
```

Common causes:

- Invalid repository URL.
- GitHub repository does not exist or is private.
- Missing or expired JWT.
- GitHub API rate limit reached.
- Backend cannot connect to the database.

## Notes for future API cleanup

- Add `/api/v1` before the API grows more.
- Keep Swagger descriptions updated as controllers change.
- Add more request validation messages.
- Add rate limiting on public repository endpoints.
- Add integration tests for auth, reports, and scheduled checks.
