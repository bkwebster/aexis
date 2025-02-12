"use client";

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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task as TaskItem } from "./tasks.task";
import { fetchTasks, updateTaskOrder } from "@/lib/api";
import UISkeleton from "@/components/ui.skeleton";
import { ErrorDisplay } from "@/components/ui.error";
import {
  startOfMonth,
  endOfMonth,
  addDays,
  isWithinInterval,
  format,
} from "date-fns";

export function TaskList({
  week = 1,
  baseDate = new Date(2025, 1, 1),
}: {
  week?: number;
  baseDate?: Date;
}) {
  const queryClient = useQueryClient();

  // Calculate week ranges more accurately
  const monthStart = startOfMonth(baseDate);
  const monthEnd = endOfMonth(baseDate);
  const weekStart =
    week === 1 ? monthStart : addDays(monthStart, (week - 1) * 7);
  const uncappedWeekEnd = addDays(weekStart, 6);
  const weekEnd = uncappedWeekEnd > monthEnd ? monthEnd : uncappedWeekEnd;

  // Log week range only in development
  if (process.env.NODE_ENV === "development") {
    console.log(`Week ${week} range:`, {
      monthStart: format(monthStart, "yyyy-MM-dd"),
      weekStart: format(weekStart, "yyyy-MM-dd"),
      weekEnd: format(weekEnd, "yyyy-MM-dd"),
    });
  }

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchTasks({ sortKey: "order" }),
  });

  // Log all tasks and their dates in development
  if (process.env.NODE_ENV === "development") {
    console.log(
      "All tasks:",
      tasks.map((task) => ({
        id: task.id,
        title: task.title,
        due_date: task.due_date,
      }))
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    const oldIndex = tasks.findIndex((task) => task.id === active.id);

    // Update the task's due date to match the target week
    const updatedTasks = [...tasks];
    updatedTasks[oldIndex] = {
      ...activeTask,
      due_date: weekStart.toISOString(),
    };

    // Optimistically update the cache
    queryClient.setQueryData(["tasks"], updatedTasks);

    try {
      await updateTaskOrder(updatedTasks);
    } catch (error) {
      console.error("Failed to update task order:", error);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  };

  if (error instanceof Error) {
    return <ErrorDisplay error={error.message} />;
  }

  if (isLoading) {
    return <UISkeleton className="h-48" />;
  }

  // Filter tasks for this week of the month
  const tasksForWeek = tasks.filter((task) => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    const isInWeek = isWithinInterval(dueDate, {
      start: weekStart,
      end: weekEnd,
    });

    // Log task filtering only in development and only for debugging
    if (process.env.NODE_ENV === "development" && isInWeek) {
      console.log(
        `Task ${task.id} (${format(
          dueDate,
          "yyyy-MM-dd"
        )}) included in week ${week}`
      );
    }

    return isInWeek;
  });

  // Log summary only in development
  if (process.env.NODE_ENV === "development") {
    console.log(
      `Week ${week} has ${tasksForWeek.length}/${tasks.length} tasks`
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[
        (args) => {
          const { transform } = args;
          return {
            ...transform,
            x: 0, // Lock horizontal movement
          };
        },
      ]}
    >
      <SortableContext
        items={tasksForWeek}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {tasksForWeek.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
