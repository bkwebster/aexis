"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/lib/api";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export function AddTask({ projectId }: { projectId?: string }) {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask({
        title,
        project_id: projectId || null,
        status: "todo",
        priority: 2, // medium priority
        order: 0,
        description: null,
        due_date: null,
        client_id: null,
      });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      setTitle("");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        required
      />
      <Button type="submit">Add Task</Button>
    </form>
  );
}
