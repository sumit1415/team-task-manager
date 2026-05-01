import { NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { z } from "zod";
import { logActivity } from "@/server/services/activity";

const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    const role = req.headers.get("x-user-role");

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let projects;
    if (role === "ADMIN") {
      projects = await db.project.findMany({
        include: { members: { include: { user: true } }, _count: { select: { tasks: true } } },
        orderBy: { createdAt: "desc" },
      });
    } else {
      projects = await db.project.findMany({
        where: { members: { some: { userId } } },
        include: { members: { include: { user: true } }, _count: { select: { tasks: true } } },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
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
    const { name, description } = projectSchema.parse(body);

    const project = await db.project.create({
      data: {
        name,
        description,
        members: {
          create: { userId }, // Admin who created it is a member
        },
      },
    });

    await logActivity({
      userId,
      action: "CREATE_PROJECT",
      entityType: "PROJECT",
      entityId: project.id,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
