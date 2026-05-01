# Demo Video Script: Team Task Manager

**Duration: ~3 Minutes**

---

**[0:00 - 0:30] Intro & Login**
- *Visual*: Show the clean, modern landing page.
- *Voiceover*: "Hi, I'm [Your Name], and this is Team Task Manager, a full-stack SaaS application I built using Next.js 14, TypeScript, and PostgreSQL. It features robust Role-Based Access Control and a Custom JWT authentication system."
- *Action*: Click "Login". Enter the demo Admin credentials (`admin@teamtask.com` / `admin123`).
- *Voiceover*: "I'm logging in as an Admin. The authentication uses HTTP-only cookies for enhanced security, bypassing standard local storage vulnerabilities."

**[0:30 - 1:00] Dashboard & Activity Logs**
- *Visual*: The main Dashboard view loads instantly. Highlight the stat cards and the Recharts bar graph.
- *Voiceover*: "Upon logging in, we see the real-time dashboard. I implemented React Query with background polling to keep these stats updated. On the right, you can see the Activity Timeline. It tracks every significant action across the system—like creating tasks or changing statuses—just like a real enterprise app."

**[1:00 - 1:40] Project Management & Creation**
- *Visual*: Click on "Projects" in the sidebar. Show the list of projects. Click "New Project".
- *Action*: Create a project called "Q3 Marketing Campaign".
- *Voiceover*: "Here we manage our workspaces. Let's create a new project. Because I'm an Admin, the RBAC middleware allows this request. The backend automatically associates me as a member of this new project."

**[1:40 - 2:30] The Kanban Board & Optimistic UI (The WOW factor)**
- *Visual*: Click into the newly created project (or the seeded "Website Redesign" project).
- *Action*: Create a new task. Then, click and drag a task from "To Do" to "In Progress".
- *Voiceover*: "This is the core feature: a fully functional Kanban board built with dnd-kit. Watch what happens when I drag a task. The UI updates instantly. I used Optimistic UI updates with React Query. It assumes the server request succeeds and updates the UI immediately, providing a snappy, near-real-time experience. If the server fails, it rolls back gracefully."

**[2:30 - 3:00] Conclusion & Tech Summary**
- *Visual*: Navigate back to the dashboard to show the updated activity log ("Admin updated task status to In Progress").
- *Voiceover*: "To wrap up, this monorepo architecture uses Prisma as the ORM, Zod for strict validation, and Tailwind with Shadcn UI for a premium look. It's fully scalable and currently deployed seamlessly on Railway. Thank you for your time!"
