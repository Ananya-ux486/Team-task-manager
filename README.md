# Team Task Manager

A full-stack web app built for managing team projects and tasks. Users can create projects, assign tasks to team members, and track progress. It has role-based access so admins can manage everything while members can update their own tasks.

## Live URL

https://team-task-manager-production-6b04.up.railway.app

## GitHub Repo

https://github.com/Ananya-ux486/team-task-manager

## What it does

- Sign up and log in with JWT authentication
- Create projects and invite team members
- Create tasks, assign them to people, set due dates
- Track task status: Todo, In Progress, Completed, Blocked
- Kanban board view and list view for tasks
- Dashboard showing task stats, overdue tasks, completion rate
- Admin and Member roles — admins manage everything, members update their own tasks
- Forgot password / reset password flow

## Tech Stack

**Frontend**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui for components
- TanStack Query for data fetching
- Zustand for auth state

**Backend**
- Node.js with Express
- TypeScript
- PostgreSQL database
- Prisma ORM
- JWT for authentication

**Deployment**
- Railway (backend + database)

## Running locally

You need Node.js 20+ and a PostgreSQL database.

```bash
git clone https://github.com/Ananya-ux486/team-task-manager.git
cd team-task-manager
npm install
```

Create a `.env` file inside the `server` folder:

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key_here
PORT=3001
NODE_ENV=development
```

Run migrations and start:

```bash
npm run db:migrate --workspace=server
npm run dev
```

Frontend runs on http://localhost:5173 and backend on http://localhost:3001

## API Endpoints

**Auth**
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

**Projects**
- GET /api/projects
- POST /api/projects
- GET /api/projects/:id
- PUT /api/projects/:id
- DELETE /api/projects/:id

**Tasks**
- GET /api/projects/:id/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

**Team**
- GET /api/projects/:id/members
- POST /api/projects/:id/members
- DELETE /api/projects/:id/members/:userId

**Dashboard**
- GET /api/dashboard

## Environment Variables

| Variable | Description |
|---|---|
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Secret key for signing tokens |
| NODE_ENV | development or production |
| PORT | Port number (Railway sets this automatically) |

## Database

Uses PostgreSQL with Prisma. Tables: users, projects, tasks, project_members, refresh_tokens, password_reset_tokens.

Run migrations with:
```bash
npm run db:migrate --workspace=server
```

Seed sample data:
```bash
npm run db:seed --workspace=server
```

This creates two test accounts:
- admin@taskflow.com / admin123456
- member@taskflow.com / member123456
