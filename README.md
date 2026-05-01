# Team Task Manager

An enterprise-grade, full-stack Task Management SaaS application built with Next.js 14 App Router.

## Tech Stack
- **Frontend & Backend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: Custom JWT with HTTP-only cookies
- **State Management**: React Query (Server State) + Zustand (Client State)
- **UI/Styling**: Tailwind CSS, ShadCN UI, Lucide Icons
- **Drag & Drop**: dnd-kit (Kanban Board)
- **Charts**: Recharts

## Features
- **Role-Based Access Control (RBAC)**: Admin and Member roles with secure middleware.
- **Project Management**: Create projects and assign members.
- **Kanban Task Board**: Drag and drop tasks across "To Do", "In Progress", and "Done" columns.
- **Optimistic UI Updates**: Instant feedback on drag-and-drop before the server responds.
- **Activity Logging**: Full audit trail of user actions across the platform.
- **Interactive Dashboard**: Real-time stats and Recharts visualization.

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Local or Railway)

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd team-task-manager

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/teamtask?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
```

### 4. Database Setup & Seeding
```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Run seed script for demo data
node prisma/seed.js
```

### 5. Running the App
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

## Railway Deployment
1. Push this code to a GitHub repository.
2. Go to [Railway](https://railway.app/), create a new project.
3. Provision a **PostgreSQL** database plugin.
4. Deploy from your GitHub repository.
5. In Railway Settings -> Variables, add `JWT_SECRET` and ensure `DATABASE_URL` is automatically populated from the Postgres plugin.
6. Under Settings -> Build, set the install command to `npm install && npx prisma generate`.
7. Enjoy your live URL!

## API Documentation
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate and set cookie
- `POST /api/auth/logout` - Clear auth cookie
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create a project (Admin only)
- `GET /api/tasks?projectId=X` - List tasks for a project
- `POST /api/tasks` - Create a task
- `PATCH /api/tasks/:id` - Update task status
- `GET /api/dashboard` - Get stats and activity logs
