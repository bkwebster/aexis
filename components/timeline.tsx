"use client";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  Fragment,
  useCallback,
  useImperativeHandle,
} from "react";
import { TaskList } from "@/components/tasks.list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getISOWeek, getISOWeekYear } from "date-fns";

interface WeekColumnProps {
  date: Date;
}

function WeekColumn({
  date,
  ...props
}: WeekColumnProps & React.HTMLAttributes<HTMLDivElement>) {
  const today = new Date();
  const currentWeek = getISOWeek(today);
  const currentYear = getISOWeekYear(today);

  const weekNum = getISOWeek(date);
  const year = getISOWeekYear(date);

  return (
    <div
      className="grid grid-rows-[64px_1fr_48px] min-w-[calc((100vw/1)-48px)] max-w-[calc((100vw/1)-48px)] md:min-w-[calc((100vw/2)-48px)] md:max-w-[calc((100vw/2)-48px)] lg:min-w-[calc((100vw/3)-48px)] lg:max-w-[calc((100vw/3)-48px)]"
      data-week={weekNum}
      data-week-date={date.toISOString()}
      data-current={
        weekNum === currentWeek && year === currentYear ? "true" : "false"
      }
      style={{ scrollSnapAlign: "start" }}
      {...props}
    >
      {/* Week header */}
      <div
        className={cn(
          "border-r border-b overflow-hidden w-full h-full",
          weekNum === currentWeek && year === currentYear && "bg-accent/10"
        )}
        data-current={
          weekNum === currentWeek && year === currentYear ? "true" : "false"
        }
      >
        <div className="p-3">
          <div className="h-[64px]" />
        </div>
      </div>
      <ScrollArea
        className={cn(
          "border-r border-b h-full w-full",
          weekNum === currentWeek && year === currentYear && "bg-accent/10"
        )}
      >
        <div className="p-3 flex flex-col gap-3">
          <TaskList week={weekNum} baseDate={date} />
        </div>
      </ScrollArea>
      <div className="border-r" />
    </div>
  );
}

export interface TimelineRef {
  scrollToToday: () => void;
}

export const Timeline = forwardRef<TimelineRef>((_, ref) => {
  const [weeks, setWeeks] = useState<Date[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [visibleWeekDate, setVisibleWeekDate] = useState(new Date());
  // const [visibleWeekNum, setVisibleWeekNum] = useState(getISOWeek(new Date()));

  const loadMoreWeeks = useCallback(
    (count: number = 3) => {
      if (isLoading) return;
      setIsLoading(true);

      setWeeks((prev) => {
        const lastWeek = prev[prev.length - 1];
        const newWeeks = Array.from({ length: count }, (_, i) => {
          const date = new Date(lastWeek);
          date.setDate(date.getDate() + (i + 1) * 7);
          return date;
        });
        return [...prev, ...newWeeks];
      });

      setIsLoading(false);
    },
    [isLoading]
  );

  // Function to scroll to today's column
  const scrollToToday = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Find the current week element more precisely
    const currentWeekElement = scrollContainer.querySelector(
      '[data-current="true"]'
    );

    if (currentWeekElement) {
      const weekLeft = (currentWeekElement as HTMLElement).offsetLeft;

      // Scroll to align the week 48px from the left edge
      scrollContainer.scrollTo({
        left: Math.max(0, weekLeft - 48),
        behavior: "smooth",
      });
    }
  };

  // Initialize with enough weeks to fill the viewport plus buffer
  useEffect(() => {
    const viewportWidth = window.innerWidth;
    const today = new Date();

    // Create a temporary week column to measure its width
    const tempColumn = document.createElement("div");
    tempColumn.className =
      "grid grid-rows-[64px_1fr_48px] min-w-[calc((100vw/1)-48px)] max-w-[calc((100vw/1)-48px)] md:min-w-[calc((100vw/2)-48px)] md:max-w-[calc((100vw/2)-48px)] lg:min-w-[calc((100vw/3)-48px)] lg:max-w-[calc((100vw/3)-48px)]";
    document.body.appendChild(tempColumn);
    const weekWidth = tempColumn.getBoundingClientRect().width;
    document.body.removeChild(tempColumn);

    const initialWeeksNeeded = Math.ceil(viewportWidth / weekWidth) + 2; // +2 for buffer

    // Start from 2 weeks before today
    const initialWeeks = Array.from({ length: initialWeeksNeeded }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - 14 + i * 7);
      return date;
    });

    setWeeks(initialWeeks);

    // Scroll to today's column after DOM has updated
    requestAnimationFrame(() => {
      setTimeout(scrollToToday, 100);
    });
  }, []);

  // // Set up intersection observer for week columns
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       // Find the entry that is most visible
  //       const mostVisible = entries.reduce((prev, current) => {
  //         return current.intersectionRatio > prev.intersectionRatio
  //           ? current
  //           : prev;
  //       });

  //       if (mostVisible && mostVisible.intersectionRatio > 0) {
  //         const element = mostVisible.target as HTMLElement;
  //         const weekDate = element.dataset.weekDate;
  //         if (weekDate) {
  //           const date = new Date(weekDate);
  //           setVisibleWeekDate(date);
  //           setVisibleWeekNum(getISOWeek(date));
  //         }
  //       }
  //     },
  //     {
  //       root: null,
  //       threshold: [0, 0.25, 0.5, 0.75, 1],
  //       rootMargin: "0px -75% 0px -48px", // This creates a detection zone near the sidebar
  //     }
  //   );

  //   // Observe week columns
  //   const weekElements = document.querySelectorAll("[data-week-date]");
  //   weekElements.forEach((element) => observer.observe(element));

  //   return () => observer.disconnect();
  // }, [weeks]);

  // Handle scroll to load more
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

      // Get the actual width of a week column
      const weekColumn = scrollContainer.querySelector("[data-week-date]");
      if (!weekColumn) return;

      const weekWidth = weekColumn.getBoundingClientRect().width;
      const visibleColumns = Math.ceil(clientWidth / weekWidth);

      // If we're within 2 viewport widths of the end, load more
      if (scrollWidth - (scrollLeft + clientWidth) < clientWidth * 2) {
        loadMoreWeeks(visibleColumns);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [loadMoreWeeks]);

  // Expose scrollToToday function
  useImperativeHandle(ref, () => ({
    scrollToToday,
  }));

  return (
    <div
      ref={scrollRef}
      className={cn("overflow-x-auto flex min-h-screen max-h-screen h-screen")}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* <div className="fixed top-[12px] left-[224px] z-10">
        <Calendar week={visibleWeekNum} baseDate={visibleWeekDate} />
      </div> */}
      {weeks.map((date, i) => {
        const weekKey = `week-${getISOWeek(date)}-${getISOWeekYear(date)}`;
        return (
          <Fragment key={weekKey}>
            <WeekColumn date={date} />
            {/* Add spacer between weeks */}
            {i < weeks.length - 1 && (
              <div className="grid grid-rows-[64px_1fr_48px] min-w-[48px]">
                <div className="border-r border-b" />
                <div className="border-r border-b" />
                <div className="border-r" />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
});

Timeline.displayName = "Timeline";
