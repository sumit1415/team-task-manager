const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean up existing data
  await prisma.activityLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminPassword = await bcrypt.hash("admin123", 10);
  const memberPassword = await bcrypt.hash("member123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@teamtask.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const member = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@teamtask.com",
      password: memberPassword,
      role: "MEMBER",
    },
  });

  // Create project
  const project = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Overhaul the corporate website with Next.js 14.",
      members: {
        create: [
          { userId: admin.id },
          { userId: member.id },
        ],
      },
    },
  });

  // Create tasks
  const t1 = await prisma.task.create({
    data: {
      title: "Design Figma Mockups",
      description: "Create landing page and dashboard mockups.",
      status: "DONE",
      projectId: project.id,
      assigneeId: admin.id,
    },
  });

  const t2 = await prisma.task.create({
    data: {
      title: "Setup Next.js Boilerplate",
      description: "Initialize App Router with Tailwind and Shadcn UI.",
      status: "IN_PROGRESS",
      projectId: project.id,
      assigneeId: member.id,
    },
  });

  const t3 = await prisma.task.create({
    data: {
      title: "Implement Authentication",
      description: "Custom JWT implementation.",
      status: "TODO",
      projectId: project.id,
      assigneeId: member.id,
      dueDate: new Date(Date.now() + 86400000 * 2), // Due in 2 days
    },
  });

  // Log some activity
  await prisma.activityLog.createMany({
    data: [
      { userId: admin.id, action: "CREATE_PROJECT", entityType: "PROJECT", entityId: project.id },
      { userId: member.id, action: "UPDATED_TASK_STATUS_TO_IN_PROGRESS", entityType: "TASK", entityId: t2.id },
      { userId: admin.id, action: "UPDATED_TASK_STATUS_TO_DONE", entityType: "TASK", entityId: t1.id },
    ],
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
