# TaskFlow — Team Task Manager

A full-stack web application for managing team projects and tasks with role-based access control.

## 🚀 Live Demo

> Add your Railway URL here after deployment.

## ✨ Features

- **Authentication** — Signup/Login with JWT + refresh tokens, Forgot/Reset password
- **Role-Based Access** — Admin and Member roles with project-level permissions
- **Project Management** — Create, update, delete projects with team membership
- **Task Management** — Full CRUD with assignment, status tracking (TODO / IN_PROGRESS / COMPLETED / BLOCKED), due dates
- **Kanban Board** — Visual task management with column-based status view
- **List View** — Table view with sorting and filtering
- **Dashboard** — Real-time stats: tasks by status, overdue count, completion rate
- **Team Management** — Add/remove members per project with role assignment

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand (auth) + TanStack Query (server state) |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (15min) + Refresh Tokens (7 days) |
| Deployment | Railway |

---

## 🚂 Deploy to Railway (Step-by-Step)

### Prerequisites
- GitHub account
- Railway account (free at [railway.app](https://railway.app))

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git
git push -u origin main
```

### Step 2 — Create Railway Project

1. Go to [railway.app](https://railway.app) → **New Project**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account and select your repository
4. Railway will detect the `nixpacks.toml` and start building

### Step 3 — Add PostgreSQL Database

1. In your Railway project, click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway automatically creates a PostgreSQL instance and injects `DATABASE_URL` into your service

### Step 4 — Set Environment Variables

In your Railway service → **Variables** tab, add:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | A random 64-character string (generate at [randomkeygen.com](https://randomkeygen.com)) |
| `DATABASE_URL` | Auto-injected by Railway PostgreSQL addon |

> **Note:** `PORT` is automatically set by Railway. `CLIENT_URL` is not needed since the server serves the frontend from the same origin.

### Step 5 — Deploy

Railway auto-deploys on every push to `main`. The build process:
1. Installs all dependencies
2. Builds the React frontend (`client/dist/`)
3. Compiles TypeScript server (`server/dist/`)
4. Generates Prisma client
5. On startup: runs `prisma migrate deploy` then starts the server

### Step 6 — Get Your Live URL

1. In Railway → your service → **Settings** → **Networking** → **Generate Domain**
2. Your app is live at `https://your-app.railway.app`

### Step 7 — Seed Initial Data (Optional)

After deployment, open Railway's shell for your service and run:
```bash
npm run db:seed --workspace=server
```

This creates:
- Admin: `admin@taskflow.com` / `admin123456`
- Member: `member@taskflow.com` / `member123456`
- 2 sample projects with tasks

---

## 💻 Local Development

### Prerequisites
- Node.js 20+
- PostgreSQL database (or use [Neon](https://neon.tech) free tier)

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/team-task-manager.git
cd team-task-manager

# Install all dependencies
npm install

# Configure environment
cp server/.env.example server/.env
# Edit server/.env with your DATABASE_URL and JWT_SECRET

# Run database migrations
npm run db:migrate --workspace=server

# (Optional) Seed sample data
npm run db:seed --workspace=server

# Start development servers
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## 📡 API Endpoints

### Authentication
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |

### Projects
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/projects` | Any | List user's projects |
| POST | `/api/projects` | Any | Create project (creator becomes Admin) |
| GET | `/api/projects/:id` | Member | Get project details |
| PUT | `/api/projects/:id` | Project Admin | Update project |
| DELETE | `/api/projects/:id` | Project Admin | Delete project |

### Team
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/projects/:id/members` | Member | List members |
| POST | `/api/projects/:id/members` | Project Admin | Add member |
| DELETE | `/api/projects/:id/members/:userId` | Project Admin | Remove member |

### Tasks
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/projects/:id/tasks` | Member | List tasks (filterable by status/assignee/overdue) |
| POST | `/api/tasks` | Project Admin | Create task |
| PUT | `/api/tasks/:id` | Member/Admin | Update task |
| DELETE | `/api/tasks/:id` | Project Admin | Delete task |

### Dashboard
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard` | Any | Get task statistics |
| GET | `/api/health` | None | Health check |

---

## 🔐 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | ✅ Yes |
| `NODE_ENV` | `development` or `production` | No (defaults to development) |
| `PORT` | Server port | No (Railway sets this automatically) |
| `CLIENT_URL` | Allowed CORS origin | No (not needed in production same-origin) |

---

## 📁 Project Structure

```
team-task-manager/
├── client/                 # React frontend (Vite + TypeScript)
│   └── src/
│       ├── components/     # UI components (shadcn/ui + custom)
│       ├── pages/          # Route pages
│       ├── hooks/          # TanStack Query hooks
│       ├── store/          # Zustand auth store
│       └── lib/            # API client, utilities
├── server/                 # Express backend (TypeScript)
│   ├── src/
│   │   ├── routes/         # Express routes
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation, error handling
│   │   └── schemas/        # Zod validation schemas
│   └── prisma/
│       └── schema.prisma   # Database schema
├── nixpacks.toml           # Railway build config
├── railway.toml            # Railway deploy config
└── README.md
```
