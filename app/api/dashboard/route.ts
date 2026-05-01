import { NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = req.headers.get("x-user-role");
    
    // Stats
    const totalTasks = await db.task.count(
      role !== "ADMIN" ? { where: { project: { members: { some: { userId } } } } } : {}
    );
    const completedTasks = await db.task.count({
      where: {
        status: "DONE",
        ...(role !== "ADMIN" && { project: { members: { some: { userId } } } }),
      },
    });
    const pendingTasks = totalTasks - completedTasks;

    // Overdue tasks
    const overdueTasks = await db.task.count({
      where: {
        dueDate: { lt: new Date() },
        status: { not: "DONE" },
        ...(role !== "ADMIN" && { project: { members: { some: { userId } } } }),
      },
    });

    // Recent Activity
    const recentActivity = await db.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json({
      stats: { totalTasks, completedTasks, pendingTasks, overdueTasks },
      recentActivity,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
