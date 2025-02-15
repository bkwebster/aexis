"use client";

import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isPast,
  isToday,
  addDays,
  subDays,
  getISOWeek,
} from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarProps {
  className?: string;
  week?: number;
  baseDate?: Date;
}

export function Calendar({
  className,
  week,
  baseDate = new Date(),
}: CalendarProps) {
  const firstDayOfMonth = startOfMonth(baseDate);
  const lastDayOfMonth = endOfMonth(baseDate);
  const currentDayIndex = new Date().getDay();
  const mondayBasedIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

  // Calculate days needed from previous month
  const daysFromPrevMonth =
    firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
  const prevMonthDays = Array.from({ length: daysFromPrevMonth }, (_, i) => {
    return subDays(firstDayOfMonth, daysFromPrevMonth - i);
  });

  // Current month days
  const currentMonthDays = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  // Calculate how many days we need from next month to complete the grid
  const totalDaysShown =
    Math.ceil((daysFromPrevMonth + currentMonthDays.length) / 7) * 7;
  const daysFromNextMonth =
    totalDaysShown - (daysFromPrevMonth + currentMonthDays.length);
  const nextMonthDays = Array.from({ length: daysFromNextMonth }, (_, i) => {
    return addDays(lastDayOfMonth, i + 1);
  });

  // Combine all days
  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  // Split into weeks
  const weeks = Array.from({ length: allDays.length / 7 }, (_, i) =>
    allDays.slice(i * 7, (i + 1) * 7)
  );

  // Get week number from the baseDate
  const weekNumber = week || getISOWeek(baseDate);

  // Find the week that contains the baseDate
  const targetWeek =
    weeks.find((weekDays) =>
      weekDays.some((day) => getISOWeek(day) === weekNumber)
    ) || weeks[0];

  // Check if we're viewing the current week
  const isCurrentWeek = getISOWeek(new Date()) === weekNumber;

  // Get the month display string
  const monthDisplay = (() => {
    if (!targetWeek) return format(baseDate, "MMM");

    const months = new Set(targetWeek.map((day) => format(day, "MMM")));
    return Array.from(months).join("-");
  })();

  return (
    <div
      className={cn("text-xs w-fit flex flex-col gap-1 select-none", className)}
    >
      <div className="text-left text-muted/50 flex justify-center items-center gap-1 relative h-2">
        <span
          className={cn("absolute left-0", isCurrentWeek && "text-foreground")}
        >
          W{weekNumber}
        </span>
        <span
          className={cn(
            "w-full text-center",
            isCurrentWeek && "text-foreground"
          )}
        >
          {monthDisplay}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-x-1 text-muted/50">
        <>
          <div
            className={cn(
              "text-left w-[15px]",
              mondayBasedIndex === 0 && isCurrentWeek && "text-foreground"
            )}
          >
            M
          </div>
          <div
            className={cn(
              "text-left w-[15px]",
              mondayBasedIndex === 1 && isCurrentWeek && "text-foreground"
            )}
          >
            T
          </div>
          <div
            className={cn(
              "text-left w-[15px]",
              mondayBasedIndex === 2 && isCurrentWeek && "text-foreground"
            )}
          >
            W
          </div>
          <div
            className={cn(
              "text-left w-[15px]",
              mondayBasedIndex === 3 && isCurrentWeek && "text-foreground"
            )}
          >
            T
          </div>
          <div
            className={cn(
              "text-left w-[15px]",
              mondayBasedIndex === 4 && isCurrentWeek && "text-foreground"
            )}
          >
            F
          </div>
          <div
            className={cn(
              "text-left w-[15px]",
              mondayBasedIndex === 5 && isCurrentWeek && "text-foreground"
            )}
          >
            S
          </div>
          <div
            className={cn(
              "text-left w-[15px]",
              mondayBasedIndex === 6 && isCurrentWeek && "text-foreground"
            )}
          >
            S
          </div>
        </>

        {targetWeek?.map((day) => {
          const isCurrentMonth = day.getMonth() === baseDate.getMonth();
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "text-left w-[15px]",
                !isToday(day) && "text-muted/50",
                isToday(day) && "text-foreground",
                !isCurrentMonth && isPast(day) && "text-muted/50",
                isCurrentMonth &&
                  isPast(day) &&
                  !isToday(day) &&
                  "text-muted/50"
              )}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
}
