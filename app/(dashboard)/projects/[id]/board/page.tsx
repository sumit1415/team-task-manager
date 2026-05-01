"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";

const COLUMNS = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

export default function KanbanBoardPage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/tasks?projectId=${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    refetchInterval: 5000, // 5s polling for near real-time updates
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", params.id] });
      const previousTasks = queryClient.getQueryData(["tasks", params.id]);

      // Optimistic update
      queryClient.setQueryData(["tasks", params.id], (old: any) => {
        return old?.map((t: any) => (t.id === id ? { ...t, status } : t));
      });

      return { previousTasks };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["tasks", params.id], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", params.id] });
    },
  });

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Determine the status being dropped into
    // overId can be a column id ("TODO", etc) or another task id.
    const isColumn = COLUMNS.some((c) => c.id === overId);
    let newStatus = overId;
    
    if (!isColumn) {
      const overTask = tasks.find((t: any) => t.id === overId);
      if (overTask) newStatus = overTask.status;
    }

    const activeTask = tasks.find((t: any) => t.id === activeId);

    if (activeTask && activeTask.status !== newStatus) {
      updateTaskStatus.mutate({ id: activeId, status: newStatus });
    }
  };

  if (isLoading) return <div>Loading board...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Board</h1>
          <p className="text-muted-foreground">Drag and drop to manage tasks.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full min-w-max pb-4">
            {COLUMNS.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={tasks.filter((t: any) => t.status === column.id)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeId ? (
              <TaskCard task={tasks.find((t: any) => t.id === activeId)} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

function Column({ column, tasks }: { column: any; tasks: any[] }) {
  return (
    <div className="w-80 flex flex-col bg-muted/50 rounded-xl">
      <div className="p-4 font-semibold flex items-center justify-between border-b bg-card rounded-t-xl">
        <span>{column.title}</span>
        <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      
      {/* Droppable Area */}
      <SortableContext
        id={column.id}
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[150px]">
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-lg opacity-50 p-4">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function SortableTask({ task }: { task: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "Task", task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  );
}

function TaskCard({ task }: { task: any }) {
  if (!task) return null;
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm border cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors">
      <h4 className="font-medium text-sm leading-tight mb-2">{task.title}</h4>
      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex -space-x-2">
          {task.assignee && (
            <div className="h-6 w-6 rounded-full bg-primary/20 border border-background flex items-center justify-center text-[10px] font-bold text-primary" title={task.assignee.name}>
              {task.assignee.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
