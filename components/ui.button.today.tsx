"use client";

import { RefObject, useEffect, useState } from "react";
import { TimelineRef } from "./timeline";
import { getISOWeek } from "date-fns";

interface TodayButtonProps {
  timelineRef: RefObject<TimelineRef | null>;
}

export default function TodayButton({ timelineRef }: TodayButtonProps) {
  const [showDate, setShowDate] = useState(true);
  const weekNumber = getISOWeek(new Date());

  useEffect(() => {
    const container = document.querySelector(".overflow-x-auto");
    if (!container) return;

    const handleScroll = () => {
      const currentWeek = container.querySelector('[data-current="true"]');
      if (!currentWeek) return;

      const containerRect = container.getBoundingClientRect();
      const weekRect = currentWeek.getBoundingClientRect();
      const containerLeft = containerRect.left;
      const weekLeft = weekRect.left;
      const weekRight = weekRect.right;

      // Show date text if current week is not in normal view
      if (weekLeft > containerLeft + 32 || weekRight < containerLeft) {
        setShowDate(true);
      } else {
        setShowDate(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    // Add resize listener to handle window size changes
    window.addEventListener("resize", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleClick = () => {
    timelineRef.current?.scrollToToday();
  };

  return (
    <button
      onClick={handleClick}
      className="font-mono text-[10px] leading-none flex flex-col items-center justify-center gap-0.5 transition-all duration-150 relative w-full h-4"
    >
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-100 ${
          showDate ? "opacity-100" : "opacity-0"
        }`}
      >
        <span>W{weekNumber}</span>
      </div>
      <div
        className={`absolute left-0 top-0 flex items-center justify-center transition-opacity duration-100 w-4 h-4 ${
          showDate ? "opacity-0" : "opacity-100"
        }`}
      >
        <svg viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15.0947 0.332563L15.6674 0.896074C15.7968 1.01617 16 1.20092 16 1.54273V7.3903H14.7621V4.32333L1.83834 4.31409L1.23788 4.92379V7.3903H0V4.61894C0 4.27714 0.203233 4.09238 0.332564 3.97229L0.905312 3.40878C1.03464 3.27945 1.20092 3.07621 1.54273 3.07621L14.7621 3.08545V1.84757L14.1524 1.22864H0V0H14.4573C14.7991 0 14.9654 0.203233 15.0947 0.332563Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </button>
  );
}
