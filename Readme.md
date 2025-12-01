# IdeaVault

IdeaVault is a collaborative platform to showcase, discover and collaborate on projects. This README documents the current implementation (frontend + backend) and how to run and extend the app.

## What it solves

Students and developers often have ideas but lack a place to present and find collaborators. IdeaVault provides a lightweight community workspace for listing projects, seeing owners, and connecting with contributors.

## System Architecture

- Frontend: React, React Router, Axios, Vite (plain CSS files used in the repo)
- Backend: Node.js + Express.js, Prisma ORM
- Database: PostgreSQL (configured in `prisma/schema.prisma`)
- Authentication: JWT-based login/signup
- Hosting examples: Frontend on Vercel, Backend on Render/Railway, Database on PlanetScale/Aiven (optional)

## Key Features (implemented)

- JWT authentication (signup / login)
- CRUD operations for projects (create, read, update, delete)
- Project owner displayed (owner username attached to project responses)
- Project timestamp shown on project cards and details
- "My Projects" section in Dashboard for the logged-in user
- Search/filter on Dashboard
- Responsive UI built with React and plain CSS

## Tech Stack (actual repo)

- Frontend: React, react-router-dom, axios, react-icons, Vite
- Backend: Node.js, Express, Prisma, PostgreSQL
- Dev tools: nodemon, eslint

## Quickstart (local)

1. Clone the repo

   git clone <repo-url>
   cd IdeaVault

2. Backend

   cd Backend
   npm install
   cp .env.example .env # fill values
   npx prisma generate
   npx prisma migrate dev --name init
   npm run start

3. Frontend

   cd ../frontend
   npm install
   npm run dev

Open the frontend URL shown by Vite (usually http://localhost:5173) and the backend runs on `http://localhost:3000` by default.

## Required environment variables

Create a `.env` file in `Backend/` with at least:

- `DATABASE_URL` — Postgres connection string
- `JWT_SECRET` — secret for signing access tokens
- `JWT_REFRESH_SECRET` — (optional) secret for refresh tokens
- `PORT` — backend port (default 3000)

See `.env.example` (added to the repo) for a template.

## API (examples)

- POST `/api/auth/signup` — register

  - body: `{ username, email, password }`
  - response: `{ user, accessToken, refreshToken }`

- POST `/api/auth/login` — login

  - body: `{ email, password }`
  - response: `{ user, accessToken, refreshToken }`

- GET `/api/projects` — list projects

  - headers: `Authorization: Bearer <token>` (routes are protected by `auth` middleware)
  - response: `{ projects: [ { id, title, description, techStack, category, tags, userId, ownerName, createdAt } ] }`

- POST `/api/projects` — create project (authenticated)

  - body: `{ title, description, techStack, category, githubLink, liveDemo, tags }`
  - response: created `project` (includes `ownerName` and `createdAt`)

- GET `/api/projects/:id` — single project (includes `ownerName`)

## Data model (Prisma)

- `User` fields: `id`, `username`, `email`, `password`, `role`, `projectIds`, `createdAt`
- `Project` fields: `id`, `title`, `description`, `techStack`, `category`, `githubLink`, `liveDemo`, `tags`, `userId`, `createdAt`

## UI notes / behavior

- Home page shows the latest 5 projects (most recent first) with owner name and relative timestamp.
- Dashboard shows metrics and a "My Projects" list for the logged-in user; you can also view another user's dashboard at `/dashboard/:id`.
- Project cards show owner, tags, tech stack and time since upload.

## Tests & Lint

- Run frontend lint: `cd frontend && npm run lint` (eslint)
- There are no automated tests configured in the repo currently.

## To improve / TODO suggestions

- Add full pagination support for `/projects` and frontend pagination controls.
- Add an endpoint `GET /api/auth/me` to validate token and retrieve current user on app load.
- Add integration or unit tests for backend endpoints.
- Harden authorization checks (only owners can edit their project, admin-only delete behavior).
- Add deploy guides and CI configuration.

## Contributing

- Fork, create a branch, implement changes, open a PR with description and testing instructions.

## License

- Add an appropriate open source license file (e.g., MIT) if you plan to open-source.

---

If you want, I can also:

- add a `.env.example` file to the repo now,
- add API curl/axios snippets for the most-used flows,
- or create a short `CONTRIBUTING.md` template.
