"use client";

import type React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task as TaskType } from "@/lib/api";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TaskProps {
  task: TaskType;
}

export function Task({ task }: TaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: isDragging ? ("relative" as const) : ("static" as const),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-manipulation"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">{task.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            {task.project && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Project:</span>
                <Badge variant="outline">{task.project.name}</Badge>
              </div>
            )}
            {task.client && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Client:</span>
                <Badge variant="outline">{task.client.name}</Badge>
              </div>
            )}
            {task.due_date && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Due:</span>
                <span>{format(new Date(task.due_date), "MMM d, yyyy")}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Status:</span>
              <Badge>{task.status}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Priority:</span>
              <Badge variant="secondary">{task.priority}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
