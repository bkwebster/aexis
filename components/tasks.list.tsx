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
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  getISOWeek,
  getISOWeekYear,
} from "date-fns";
import { useMemo } from "react";

export function TaskList({
  week = 1,
  baseDate = new Date(2025, 1, 1),
}: {
  week?: number;
  baseDate?: Date;
}) {
  const queryClient = useQueryClient();

  // Calculate week boundaries using pure ISO week logic
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 }); // Sunday

  // Calculate ISO week number
  const isoWeek = getISOWeek(weekStart);
  const isoYear = getISOWeekYear(weekStart);

  // Log week range only in development
  if (process.env.NODE_ENV === "development") {
    console.log(`Week ${isoWeek} (ISO) range:`, {
      weekStart: format(weekStart, "yyyy-MM-dd"),
      weekEnd: format(weekEnd, "yyyy-MM-dd"),
      isoWeek,
      isoYear,
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

  // Group tasks by day within the week
  const tasksByDay = useMemo(() => {
    const days = eachDayOfInterval({
      start: weekStart,
      end: weekEnd,
    });

    return days.reduce((acc, day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayTasks = tasks.filter((task) => {
        if (!task.due_date) return false;
        return isSameDay(new Date(task.due_date), day);
      });
      acc[dayStr] = dayTasks;
      return acc;
    }, {} as Record<string, typeof tasks>);
  }, [tasks, weekStart, weekEnd]);

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

    // Get the target day from the container ID
    const targetDay = over.id.toString().split("-")[0]; // Format: "yyyy-MM-dd-container"

    // Update the task's due date to the target day
    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex((t) => t.id === active.id);
    if (taskIndex !== -1) {
      updatedTasks[taskIndex] = {
        ...activeTask,
        due_date: new Date(targetDay).toISOString(),
      };
    }

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

  // Get all days in the week
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  });

  return (
    <div className="space-y-4">
      {/* Add a week indicator at the top */}
      <div className="text-xs font-medium text-muted-foreground mb-2">
        Week {week}
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {weekDays.map((day) => {
          const dayStr = format(day, "yyyy-MM-dd");
          const dayTasks = tasksByDay[dayStr] || [];

          return (
            <div key={dayStr} className="space-y-2">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="w-[24px] text-center">{format(day, "d")}</span>
                <span>{format(day, "EEEE, MMM")}</span>
              </div>
              <div
                id={`${dayStr}-container`}
                data-week={week}
                className="space-y-2 min-h-[32px] bg-accent/5 rounded-md p-2 ml-[24px]"
              >
                {dayTasks.length > 0 ? (
                  <SortableContext
                    items={dayTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {dayTasks.map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </SortableContext>
                ) : (
                  <div className="text-xs text-muted-foreground/50 h-[32px] flex items-center justify-center">
                    No tasks scheduled this day
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </DndContext>
    </div>
  );
}
