import { NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { z } from "zod";
import { logActivity } from "@/server/services/activity";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  projectId: z.string(),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    const role = req.headers.get("x-user-role");
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const where: any = {};
    if (projectId) where.projectId = projectId;

    // Members only see tasks in projects they belong to
    if (role !== "ADMIN") {
      const userProjects = await db.projectMember.findMany({
        where: { userId },
        select: { projectId: true },
      });
      const projectIds = userProjects.map((p) => p.projectId);
      where.projectId = { in: projectIds };
      if (projectId && !projectIds.includes(projectId)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const tasks = await db.task.findMany({
      where,
      include: { assignee: { select: { name: true, email: true } }, project: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    const role = req.headers.get("x-user-role");

    if (!userId || role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, projectId, assigneeId, dueDate } = taskSchema.parse(body);

    const task = await db.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: { assignee: { select: { name: true } } }
    });

    await logActivity({
      userId,
      action: "CREATE_TASK",
      entityType: "TASK",
      entityId: task.id,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
