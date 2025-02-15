"use client";

import { Timeline, TimelineRef } from "@/components/timeline";
import UIUser from "@/components/ui.user";
import { Library, PenLine, Pyramid } from "lucide-react";
// import TodayButton from "@/components/ui.button.today";
import { useRef } from "react";

export default function DashboardClient() {
  const timelineRef = useRef<TimelineRef>(null);

  return (
    <div className="grid grid-cols-[128px_1fr] grid-rows-32px_1fr">
      <div className="grid grid-cols-[128px] grid-rows-[64px_1fr_48px] gap-0 h-screen overflow-hidden">
        <div className="border-r border-b flex flex-col items-center justify-start relative w-full h-[64px] hover:bg-accent/10">
          <div className="flex flex-col justify-end items-end h-full w-full p-2">
            <div className="bg-foreground text-background rounded-md p-1 w-[18px] h-[18px] flex items-center justify-center">
              <PenLine size={16} strokeWidth={2.1} />
            </div>
          </div>
        </div>
        <div className="border-r border-b flex relative h-full p-2">
          <div className="flex flex-col gap-3 w-full h-full justify-start items-end">
            <Pyramid
              size={16}
              strokeWidth={1.5}
              className="text-foreground hover:text-foreground transition-colors duration-120 cursor-pointer"
            />
            <Library
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
