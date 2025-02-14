"use client";

import { RefObject } from "react";
import { TimelineRef } from "./timeline";

interface TodayButtonProps {
  timelineRef: RefObject<TimelineRef | null>;
}

export default function TodayButton({ timelineRef }: TodayButtonProps) {
  const handleClick = () => {
    timelineRef.current?.scrollToToday();
  };

  const month = new Date().toLocaleDateString("en-US", {
    month: "short",
  });

  const weekDay = new Date().toLocaleDateString("en-US", {
    weekday: "short",
  });

  const day = new Date().toLocaleDateString("en-US", {
    day: "numeric",
  });

  return (
    <div
      onClick={handleClick}
      className={`text-xs relative w-[48px] h-[64px] cursor-pointer`}
    >
      <span className="opacity-10 group-hover:opacity-100 transition-opacity duration-150 text-foreground w-[30px] h-[30px]">
        <div className="flex items-center justify-center w-full">
          <div className="w-4 mx-auto">
            <svg
              viewBox="0 0 16 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="select-none"
            >
              <path
                d="M15.0947 0.332563L15.6674 0.896074C15.7968 1.01617 16 1.20092 16 1.54273V7.3903H14.7621V4.32333L1.83834 4.31409L1.23788 4.92379V7.3903H0V4.61894C0 4.27714 0.203233 4.09238 0.332564 3.97229L0.905312 3.40878C1.03464 3.27945 1.20092 3.07621 1.54273 3.07621L14.7621 3.08545V1.84757L14.1524 1.22864H0V0H14.4573C14.7991 0 14.9654 0.203233 15.0947 0.332563Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </span>
      <div className="opacity-100 group-hover:opacity-10 transition-opacity duration-150 w-[30px] h-[30px] flex flex-col items-start justify-start select-none">
        <span className="opacity-100 group-hover:opacity-0 transition-opacity duration-150 flex flex-col items-start justify-start">
          <div>{weekDay}</div>
          <div className="-mt-1">
            <span className="opacity-20">&bull;</span>
            {day}
          </div>
        </span>
      </div>
    </div>
  );
}
