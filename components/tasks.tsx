"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task } from "./tasks.task";
import { format } from "date-fns";
import {
  fetchTasks,
  updateTaskOrder,
  subscribeToTasks,
  type Task as TaskType,
} from "@/lib/api";
import UISkeleton from "@/components/ui.skeleton";

type SortKey = "title" | "project" | "due_date";

export function TaskList({ projectId }: { projectId?: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery<TaskType[]>({
    queryKey: ["tasks", projectId],
    queryFn: () => fetchTasks(projectId),
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });

  useEffect(() => {
    const unsubscribe = subscribeToTasks(() => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    });

    return () => {
      unsubscribe();
    };
  }, [projectId, queryClient]);

  const formattedTasks = tasks.map((task) => ({
    ...task,
    formattedDate: task.due_date
      ? format(new Date(task.due_date), "MMM d, yyyy")
      : "No due date",
  }));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over?.id);

      const newTasks = arrayMove(tasks, oldIndex, newIndex);

      // Optimistically update the cache
      queryClient.setQueryData(["tasks", projectId], newTasks);

      try {
        await updateTaskOrder(newTasks);
      } catch (error) {
        console.error("Failed to update task order:", error);
        // Revert the optimistic update
        queryClient.setQueryData(["tasks", projectId], tasks);
      }
    }
  };

  const sortTasks = (key: SortKey) => {
    setSortKey(key);
    const sortedTasks = [...tasks].sort((a, b) => {
      if (key === "due_date") {
        return (
          new Date(a.due_date || "").getTime() -
          new Date(b.due_date || "").getTime()
        );
      }
      if (key === "project") {
        return (a.project?.name || "").localeCompare(b.project?.name || "");
      }
      return (a[key] || "").toString().localeCompare((b[key] || "").toString());
    });

    // Update the cache with the sorted tasks
    queryClient.setQueryData(["tasks", projectId], sortedTasks);
  };

  if (isLoading) return <UISkeleton />;
  if (error) return <div>Error loading tasks</div>;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4 flex justify-between">
        <button
          onClick={() => sortTasks("title")}
          className={`px-2 py-1 rounded ${
            sortKey === "title"
              ? "bg-blue-600 text-white"
              : "bg-blue-200 text-blue-800"
          }`}
        >
          Sort by Title
        </button>
        <button
          onClick={() => sortTasks("project")}
          className={`px-2 py-1 rounded ${
            sortKey === "project"
              ? "bg-green-600 text-white"
              : "bg-green-200 text-green-800"
          }`}
        >
          Sort by Project
        </button>
        <button
          onClick={() => sortTasks("due_date")}
          className={`px-2 py-1 rounded ${
            sortKey === "due_date"
              ? "bg-red-600 text-white"
              : "bg-red-200 text-red-800"
          }`}
        >
          Sort by Date
        </button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {formattedTasks.map((task) => (
            <Task key={task.id} id={task.id}>
              <div className="bg-white p-4 mb-2 rounded shadow">
                <h3 className="font-bold">{task.title}</h3>
                <p className="text-sm text-gray-600">
                  Project: {task.project?.name || "No project"}
                </p>
                <p className="text-sm text-gray-600">
                  Client: {task.client?.name || "No client"}
                </p>
                <p className="text-sm text-gray-600">
                  Due: {task.formattedDate}
                </p>
                <p className="text-sm text-gray-600">Status: {task.status}</p>
                <p className="text-sm text-gray-600">
                  Priority: {task.priority}
                </p>
              </div>
            </Task>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
