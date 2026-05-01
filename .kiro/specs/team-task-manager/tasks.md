# Implementation Plan: Team Task Manager

## Phase 1: Project Setup & Infrastructure

- [ ] 1. Initialize monorepo structure
  - [ ] 1.1 Create root package.json with workspace scripts and concurrently
  - [ ] 1.2 Create server directory with Express + TypeScript + Prisma setup
  - [ ] 1.3 Create client directory with React + TypeScript + Vite setup
  - [ ] 1.4 Configure Tailwind CSS and shadcn/ui in client
  - [ ] 1.5 Create .env.example files for both server and client

- [ ] 2. Database schema and Prisma setup
  - [ ] 2.1 Write Prisma schema (User, Project, Task, ProjectMember, RefreshToken)
  - [ ] 2.2 Create initial migration
  - [ ] 2.3 Generate Prisma client
  - [ ] 2.4 Create singleton Prisma client module

## Phase 2: Backend - Authentication

- [ ] 3. Auth utilities and middleware
  - [ ] 3.1 Implement password hashing utilities (bcrypt)
  - [ ] 3.2 Implement JWT sign/verify utilities
  - [ ] 3.3 Implement authenticateToken middleware
  - [ ] 3.4 Implement global error handler middleware
  - [ ] 3.5 Implement Zod validation middleware

- [ ] 4. Auth endpoints
  - [ ] 4.1 POST /api/auth/signup
  - [ ] 4.2 POST /api/auth/login
  - [ ] 4.3 POST /api/auth/refresh
  - [ ] 4.4 POST /api/auth/logout

## Phase 3: Backend - Projects & Teams

- [ ] 5. Project middleware
  - [ ] 5.1 Implement requireProjectMember middleware
  - [ ] 5.2 Implement requireProjectAdmin middleware

- [ ] 6. Project endpoints
  - [ ] 6.1 GET /api/projects
  - [ ] 6.2 POST /api/projects
  - [ ] 6.3 GET /api/projects/:id
  - [ ] 6.4 PUT /api/projects/:id
  - [ ] 6.5 DELETE /api/projects/:id

- [ ] 7. Team membership endpoints
  - [ ] 7.1 POST /api/projects/:id/members
  - [ ] 7.2 DELETE /api/projects/:id/members/:userId
  - [ ] 7.3 GET /api/projects/:id/members

## Phase 4: Backend - Tasks & Dashboard

- [ ] 8. Task endpoints
  - [ ] 8.1 GET /api/projects/:id/tasks (with filters: status, assigneeId, overdue)
  - [ ] 8.2 POST /api/tasks
  - [ ] 8.3 PUT /api/tasks/:id
  - [ ] 8.4 DELETE /api/tasks/:id
  - [ ] 8.5 GET /api/tasks/:id

- [ ] 9. Dashboard endpoint
  - [ ] 9.1 GET /api/dashboard (with optional projectId query param)

## Phase 5: Frontend - Foundation

- [ ] 10. Frontend foundation
  - [ ] 10.1 Set up React Router v6 with route structure
  - [ ] 10.2 Create Zustand auth store with localStorage persistence
  - [ ] 10.3 Create Axios API client with JWT interceptor and auto-refresh
  - [ ] 10.4 Create TanStack Query client configuration
  - [ ] 10.5 Create shared TypeScript types
  - [ ] 10.6 Create AppLayout with sidebar navigation

## Phase 6: Frontend - Auth Pages

- [ ] 11. Authentication pages
  - [ ] 11.1 Create LoginPage with form validation
  - [ ] 11.2 Create SignupPage with form validation
  - [ ] 11.3 Create ProtectedLayout (auth guard)
  - [ ] 11.4 Implement logout functionality

## Phase 7: Frontend - Dashboard & Projects

- [ ] 12. Dashboard page
  - [ ] 12.1 Create StatCard component
  - [ ] 12.2 Create DashboardPage with task stats (TODO, IN_PROGRESS, COMPLETED, BLOCKED)
  - [ ] 12.3 Add overdue count and assigned-to-me count cards
  - [ ] 12.4 Add project summary list on dashboard

- [ ] 13. Projects pages
  - [ ] 13.1 Create ProjectsPage with project cards grid
  - [ ] 13.2 Create CreateProjectModal
  - [ ] 13.3 Create EditProjectModal
  - [ ] 13.4 Add delete project with confirmation dialog

## Phase 8: Frontend - Project Detail & Tasks

- [ ] 14. Project detail page
  - [ ] 14.1 Create ProjectDetailPage with tabs (Tasks / Team)
  - [ ] 14.2 Create TaskFilters component (status, assignee, overdue toggle)
  - [ ] 14.3 Create KanbanBoard with KanbanColumn components
  - [ ] 14.4 Create TaskList (list view) component
  - [ ] 14.5 Create TaskCard component with status badge and due date
  - [ ] 14.6 Add view toggle (Kanban / List)

- [ ] 15. Task modals
  - [ ] 15.1 Create CreateTaskModal with all fields
  - [ ] 15.2 Create EditTaskModal (Admin: all fields, Member: status only)
  - [ ] 15.3 Add delete task with confirmation (Admin only)

- [ ] 16. Team management
  - [ ] 16.1 Create TeamManagementModal showing members with roles
  - [ ] 16.2 Add member search and add functionality (Admin only)
  - [ ] 16.3 Add remove member functionality (Admin only)

## Phase 9: Testing

- [ ] 17. Property-based tests
  - [ ] 17.1 Set up Vitest + fast-check in server
  - [ ] 17.2 Write fast-check generators (email, password, project name, task title, dates, status)
  - [ ] 17.3 Property 8: Password hash verification round-trip
  - [ ] 17.4 Property 5: Overdue task filter correctness
  - [ ] 17.5 Property 4: Status update idempotence
  - [ ] 17.6 Property 6: Invalid input rejection
  - [ ] 17.7 Property 11: Member role authorization invariant

- [ ] 18. Unit and integration tests
  - [ ] 18.1 Auth service unit tests
  - [ ] 18.2 Task service unit tests
  - [ ] 18.3 Auth routes integration tests

## Phase 10: Deployment & Documentation

- [ ] 19. Railway deployment configuration
  - [ ] 19.1 Create railway.json / nixpacks.toml configuration
  - [ ] 19.2 Configure production static file serving in Express
  - [ ] 19.3 Add database migration script for production

- [ ] 20. README documentation
  - [ ] 20.1 Write project overview and features
  - [ ] 20.2 Write local development setup instructions
  - [ ] 20.3 Write Railway deployment instructions
  - [ ] 20.4 Document all API endpoints
  - [ ] 20.5 Document environment variables
