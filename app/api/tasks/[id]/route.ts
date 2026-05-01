import { NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { z } from "zod";
import { logActivity } from "@/server/services/activity";

const updateSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  assigneeId: z.string().nullable().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const data = updateSchema.parse(body);

    const task = await db.task.update({
      where: { id: params.id },
      data,
    });

    await logActivity({
      userId,
      action: data.status ? `UPDATED_TASK_STATUS_TO_${data.status}` : "UPDATED_TASK",
      entityType: "TASK",
      entityId: task.id,
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = req.headers.get("x-user-id");
    const role = req.headers.get("x-user-role");

    if (!userId || role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.task.delete({
      where: { id: params.id },
    });

    await logActivity({
      userId,
      action: "DELETE_TASK",
      entityType: "TASK",
      entityId: params.id,
    });

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
