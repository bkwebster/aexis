"use client";

import { Timeline, TimelineRef } from "@/components/timeline";
import UIUser from "@/components/ui.user";
import { CalendarIcon, PenLine, Rows3 } from "lucide-react";
import TodayButton from "@/components/ui.button.today";
import { useRef } from "react";

export default function DashboardPage() {
  const timelineRef = useRef<TimelineRef>(null);

  return (
    <div className="grid grid-cols-[32px_1fr]">
      <div className="grid grid-cols-[32px] grid-rows-[30px_1fr_30px] gap-0 h-screen overflow-hidden">
        <div className="border-r border-b flex items-center justify-center relative p-2">
          <TodayButton timelineRef={timelineRef} />
        </div>
        <div className="border-r border-b flex relative h-full p-2">
          <div className="flex flex-col gap-3 w-full h-full justify-start items-end">
            <Rows3
              size="16"
              strokeWidth="1.5"
              className="text-foreground hover:text-foreground transition-colors duration-120 cursor-pointer"
            />
            <PenLine
              size="16"
              strokeWidth="1.5"
              className="text-muted hover:text-foreground transition-colors duration-120 cursor-pointer"
            />
            <CalendarIcon
              size={16}
              strokeWidth={1.5}
              className="text-muted hover:text-foreground transition-colors duration-120 cursor-pointer"
            />
          </div>
        </div>
        <div className="border-r flex relative h-full">
          <div className="mt-auto mr-[2px] w-full absolute bottom-1.5 left-1.5">
            <UIUser />
          </div>
        </div>
      </div>
      <Timeline ref={timelineRef} />
    </div>
  );
}
