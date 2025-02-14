"use client";

import { Minus, Square, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

declare global {
  interface Window {
    electron: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      isMaximized: () => boolean;
    };
  }
}

// Add WebkitAppRegion to CSSProperties
declare module "react" {
  interface CSSProperties {
    WebkitAppRegion?: "drag" | "no-drag";
  }
}

export default function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const handleMaximizeChange = () => {
      setIsMaximized(window.electron?.isMaximized());
    };

    window.addEventListener("resize", handleMaximizeChange);
    return () => window.removeEventListener("resize", handleMaximizeChange);
  }, []);

  return (
    <>
      {/* Draggable edge */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ WebkitAppRegion: "no-drag" }}
      >
        <div
          className="absolute inset-x-0 top-0 h-[8px] cursor-grab hover:cursor-grabbing pointer-events-auto"
          style={{ WebkitAppRegion: "drag" }}
        />
        <div
          className="absolute inset-y-0 top-[180px] left-0 w-[8px] cursor-grab hover:cursor-grabbing pointer-events-auto"
          style={{ WebkitAppRegion: "drag" }}
        />
        <div
          className="absolute inset-y-0 right-0 w-[8px] cursor-grab hover:cursor-grabbing pointer-events-auto"
          style={{ WebkitAppRegion: "drag" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[8px] cursor-grab hover:cursor-grabbing pointer-events-auto"
          style={{ WebkitAppRegion: "drag" }}
        />
      </div>

      <div className="flex items-center justify-end gap-2 px-3 py-2 absolute top-0 right-0 z-50 -mr-[1px]">
        <button
          onClick={() => window.electron?.minimize()}
          className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors duration-150"
        >
          <Minus className="w-2 h-2 opacity-0 group-hover:opacity-50" />
        </button>
        <button
          onClick={() => window.electron?.maximize()}
          className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-300 transition-colors duration-150"
        >
          <Square className="w-2 h-2 opacity-0 group-hover:opacity-50" />
        </button>
        <button
          onClick={() => window.electron?.close()}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors duration-150"
        >
          <X className="w-2 h-2 opacity-0 group-hover:opacity-50" />
        </button>
      </div>
    </>
  );
}
