Team Task Manager
===================

This is a Full-Stack Web Application for Team Task Management, fulfilling all the assignment requirements:
1. Authentication (Signup/Login)
2. Project & Team Management
3. Task Creation, Assignment & Status Tracking
4. Dashboard (Tasks, Status, Overdue)
5. REST APIs + Database (SQLite locally, PostgreSQL for production)
6. Role-Based Access Control (Admin/Member)

## Tech Stack
- Frontend: Next.js (App Router), React, Vanilla CSS (Premium Glassmorphism Design)
- Backend: Next.js API Routes (REST APIs), Prisma ORM
- Database: SQLite (local dev), PostgreSQL (Railway production)
- Validation: Zod
- Auth: Custom JWT Authentication via HTTP-only Cookies

## Role-Based Access Control (RBAC)
- The FIRST user who registers becomes an `ADMIN`. All subsequent users become `MEMBER`s.
- Only Admins can create Projects, add/remove members from Projects, and delete Tasks they did not create.
- Members can view projects they are assigned to, create tasks within them, and update their task statuses.
- Route protection is implemented using a Next.js Edge Middleware verifying the JWT.

## Local Development Setup

1. Install dependencies:
   `npm install`

2. Set up the Database:
   The `.env` file should contain:
   `DATABASE_URL="file:./dev.db"`
   
   Run the following commands to generate the Prisma client and push the schema to SQLite:
   `npx prisma generate`
   `npx prisma db push`

3. Start the development server:
   `npm run dev`

4. Access the app at `http://localhost:3000`

## Deployment to Railway (Mandatory Instructions)

Since I am an AI, I cannot log in to your Railway account. Follow these steps to deploy and obtain your Live URL.

### 1. Push Code to GitHub
1. Create a new repository on GitHub (e.g., `team-task-manager`).
2. Run these commands in your terminal to push the code:
   `cd team-task-manager`
   `git init`
   `git add .`
   `git commit -m "Initial commit"`
   `git branch -M main`
   `git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git`
   `git push -u origin main`

### 2. Deploy on Railway
1. Go to Railway (railway.app) and log in.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your newly created `team-task-manager` repository.
4. Railway will automatically detect Next.js.
5. **Add a PostgreSQL Database:**
   - In your Railway project, click **New** -> **Database** -> **Add PostgreSQL**.
   - Wait for the database to provision.
6. **Set Environment Variables:**
   - Go to your Next.js service settings -> **Variables**.
   - Add `DATABASE_URL` and paste the connection string from your Railway PostgreSQL database (it should look like `postgresql://postgres:password@host:port/railway`).
   - Add `JWT_SECRET` and set it to a secure random string.
7. **Deploy:**
   - Railway will automatically rebuild and deploy.
   - Click the **Settings** tab of the Next.js service, scroll down to **Domains**, and click **Generate Domain** to get your Live URL!

## API Endpoints Overview

- POST /api/auth/register : Register a new user
- POST /api/auth/login : Login and receive HTTP-only cookie
- POST /api/auth/logout : Clear token cookie
- GET /api/auth/me : Get current user details

- GET /api/projects : List projects (Admin: All, Member: Assigned)
- POST /api/projects : Create project (Admin only)
- GET /api/projects/:id : Get project details
- POST /api/projects/:id/members : Add member (Admin only)
- DELETE /api/projects/:id/members/:userId : Remove member (Admin only)

- GET /api/tasks : List all tasks
- POST /api/tasks : Create task
- PATCH /api/tasks/:id : Update task status/assignment
- DELETE /api/tasks/:id : Delete task (Admin or Creator only)
