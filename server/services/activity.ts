import { db } from "@/lib/db/prisma";

export async function logActivity({
  userId,
  action,
  entityType,
  entityId,
}: {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
}) {
  try {
    await db.activityLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
