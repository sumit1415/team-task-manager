"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, CheckSquare } from "lucide-react";

export default function MyTasksPage() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["all_tasks"],
    queryFn: async () => {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        <p className="text-muted-foreground">Overview of all tasks across your projects.</p>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        {tasks?.length === 0 ? (
          <div className="py-12 text-center">
            <CheckSquare className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No tasks found</h3>
            <p className="text-muted-foreground text-sm">You have no tasks assigned or available.</p>
          </div>
        ) : (
          <ul className="divide-y">
            {tasks?.map((task: any) => (
              <li key={task.id} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {task.status === "DONE" ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : task.status === "IN_PROGRESS" ? (
                    <Clock className="h-5 w-5 text-orange-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                  )}
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Project: {task.project?.name} | Created: {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted">
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
