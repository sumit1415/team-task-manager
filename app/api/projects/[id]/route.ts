import { NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { logActivity } from "@/server/services/activity";

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

    await db.project.delete({
      where: { id: params.id },
    });

    await logActivity({
      userId,
      action: "DELETE_PROJECT",
      entityType: "PROJECT",
      entityId: params.id,
    });

    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
