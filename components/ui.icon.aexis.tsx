"use client";

import { toast } from "sonner";
import { RefObject, useEffect, useState } from "react";
import { TimelineRef } from "./timeline";
import { cn } from "@/lib/utils";

interface AexisIconProps {
  timelineRef: RefObject<TimelineRef | null>;
}

export default function AexisIcon({ timelineRef }: AexisIconProps) {
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    const container = document.querySelector(".overflow-x-auto");
    if (!container) return;

    const handleScroll = () => {
      const currentWeek = container.querySelector('[data-current="true"]');
      if (!currentWeek) return;

      const containerRect = container.getBoundingClientRect();
      const weekRect = currentWeek.getBoundingClientRect();

      // Left edge of the container (grid area)
      const containerLeft = containerRect.left;
      // Left edge of current week
      const weekLeft = weekRect.left;
      // Right edge of current week
      const weekRight = weekRect.right;

      // Show Right Arrow: If current week is pushed right (past dates visible)
      if (weekLeft > containerLeft + 32) {
        setDirection("right");
      }
      // Show Left Arrow: Only when current week is completely out of view to the left
      else if (weekRight < containerLeft) {
        setDirection("left");
      }
      // Show AEXIS logo: If current week is visible at all
      else {
        setDirection(null);
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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(`
      <svg viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.0947 0.332563L15.6674 0.896074C15.7968 1.01617 16 1.20092 16 1.54273V7.3903H14.7621V4.32333L1.83834 4.31409L1.23788 4.92379V7.3903H0V4.61894C0 4.27714 0.203233 4.09238 0.332564 3.97229L0.905312 3.40878C1.03464 3.27945 1.20092 3.07621 1.54273 3.07621L14.7621 3.08545V1.84757L14.1524 1.22864H0V0H14.4573C14.7991 0 14.9654 0.203233 15.0947 0.332563Z" fill="currentColor" />
      </svg>
    `);
    toast("Copied!", {
      description: "SVG code copied to clipboard",
    });
  };

  const handleClick = () => {
    timelineRef.current?.scrollToToday();
  };

  return (
    <div
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className="cursor-pointer w-4 h-4 flex items-center justify-center"
    >
      {direction === null ? (
        // AEXIS Logo
        <svg
          viewBox="0 0 16 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-150"
        >
          <path
            d="M15.0947 0.332563L15.6674 0.896074C15.7968 1.01617 16 1.20092 16 1.54273V7.3903H14.7621V4.32333L1.83834 4.31409L1.23788 4.92379V7.3903H0V4.61894C0 4.27714 0.203233 4.09238 0.332564 3.97229L0.905312 3.40878C1.03464 3.27945 1.20092 3.07621 1.54273 3.07621L14.7621 3.08545V1.84757L14.1524 1.22864H0V0H14.4573C14.7991 0 14.9654 0.203233 15.0947 0.332563Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        // Arrow Icon
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("transition-transform duration-150", {
            "rotate-180": direction === "left",
            "-rotate-180": direction === "right",
          })}
        >
          <path
            d="M1 8h14M8 1l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
