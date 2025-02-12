"use client";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  Fragment,
} from "react";
import { Calendar } from "@/components/ui.calendar";
import { TaskList } from "@/components/tasks.list";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  addMonths,
  getMonth,
  getYear,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  getISOWeek,
  subMonths,
  getISOWeekYear,
  format,
} from "date-fns";
import { cn } from "@/lib/utils";

interface MonthColumnProps {
  date: Date;
}

function MonthColumn({
  date,
  ...props
}: MonthColumnProps & React.HTMLAttributes<HTMLDivElement>) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const today = new Date();
  const currentWeek = getISOWeek(today);

  const weeksInMonth = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 }
  ).map((weekStart) => getISOWeek(weekStart));

  return (
    <div className="contents" {...props}>
      {/* Add spacer before the first week of the month */}
      <div className="grid grid-rows-[96px_1fr_30px] min-w-[28px]">
        <div className="border-r border-b" />
        <div className="border-r border-b" />
        <div className="border-r" />
      </div>
      <div className="grid bg-border/20 grid-rows-[96px_1fr_30px] min-w-[128px]">
        <div className="border-r border-b text-xs uppercase font-mono p-3 text-muted">
          {format(monthStart, "MMM")}
        </div>
        <div className="border-r border-b" />
        <div className="border-r" />
      </div>
      <div className="grid grid-rows-[96px_1fr_30px] min-w-[28px]">
        <div className="border-r border-b" />
        <div className="border-r border-b" />
        <div className="border-r" />
      </div>

      {weeksInMonth.map((weekNum, i) => (
        <Fragment key={`week-group-${weekNum}`}>
          <div
            className="grid grid-rows-[96px_1fr_30px] min-w-[240px]"
            data-week={weekNum}
            data-current={
              weekNum === currentWeek &&
              getISOWeekYear(date) === getISOWeekYear(today)
                ? "true"
                : "false"
            }
          >
            {/* Calendar + Tasks Column */}
            <div
              className={cn(
                "border-r border-b overflow-hidden w-full h-full",
                weekNum === currentWeek &&
                  getISOWeekYear(date) === getISOWeekYear(today) &&
                  "bg-accent/10"
              )}
            >
              <div className="p-3">
                <Calendar week={i + 1} baseDate={date} />
              </div>
            </div>
            <ScrollArea
              className={cn(
                "border-r border-b h-full w-full",
                weekNum === currentWeek &&
                  getISOWeekYear(date) === getISOWeekYear(today) &&
                  "bg-accent/10"
              )}
            >
              <div className="p-3 flex flex-col gap-3">
                <TaskList week={i + 1} baseDate={date} />
              </div>
            </ScrollArea>
            <div className="border-r" />
          </div>

          {/* Add 28px spacer between weeks */}
          {i < weeksInMonth.length - 1 && (
            <div
              key={`week-spacer-${weekNum}`}
              className="grid grid-rows-[96px_1fr_30px] min-w-[28px]"
            >
              <div className="border-r border-b" />
              <div className="border-r border-b" />
              <div className="border-r" />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export interface TimelineRef {
  scrollToToday: () => void;
}

export const Timeline = forwardRef<TimelineRef>((_, ref) => {
  const [months, setMonths] = useState<Date[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to scroll to today's column
  const scrollToToday = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Find element with the highlighted background
    const highlightedWeek = scrollContainer.querySelector(".bg-accent\\/10");

    if (highlightedWeek) {
      // Simply scroll the highlighted week to the start
      scrollContainer.scrollTo({
        left: (highlightedWeek as HTMLElement).offsetLeft - 32,
        behavior: "smooth",
      });
    }
  };

  // Expose scrollToToday function
  useImperativeHandle(
    ref,
    () => ({
      scrollToToday,
    }),
    []
  );

  // Initialize with enough months to fill the viewport plus buffer
  useEffect(() => {
    const monthWidth = 1200; // width of each month column
    const viewportWidth = window.innerWidth;
    const initialMonthsNeeded = Math.ceil(viewportWidth / monthWidth) + 2; // +2 for buffer
    const today = new Date();

    // Start from 2 months before today
    const initialMonths = Array.from({ length: initialMonthsNeeded }, (_, i) =>
      addMonths(subMonths(today, 2), i)
    );

    setMonths(initialMonths);

    // Scroll to today's column after DOM has updated
    requestAnimationFrame(() => {
      setTimeout(scrollToToday, 100);
    });
  }, []);

  const loadMoreMonths = () => {
    if (isLoading) return;
    setIsLoading(true);

    // Add next 3 months as a batch
    setMonths((prev) => {
      const lastMonth = prev[prev.length - 1];
      const newMonths = [1, 2, 3].map((i) => addMonths(lastMonth, i));
      return [...prev, ...newMonths];
    });

    setIsLoading(false);
  };

  // Handle scroll to load more
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      // If we're within 2 viewport widths of the end, load more
      if (scrollWidth - (scrollLeft + clientWidth) < clientWidth * 2) {
        loadMoreMonths();
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [loadMoreMonths]);

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto flex snap-x snap-mandatory"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {months.map((date) => (
        <MonthColumn
          key={`${getYear(date)}-${getMonth(date)}`}
          date={date}
          data-month={`${getYear(date)}-${getMonth(date)}`}
        />
      ))}
    </div>
  );
});

Timeline.displayName = "Timeline";
