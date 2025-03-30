"use client";

import { ChevronsUpDown, Minus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

declare global {
  interface Window {
    electron: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      hide: () => void;
      quit: () => void;
      isMaximized: () => boolean;
      createWindow: () => void;
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

  // Global app shortcuts
  useHotkeys("cmd+w", () => window.electron?.hide(), { preventDefault: true });
  useHotkeys("cmd+q", () => window.electron?.quit(), { preventDefault: true });

  useEffect(() => {
    const handleMaximizeChange = () => {
      setIsMaximized(window.electron?.isMaximized());
    };

    window.addEventListener("resize", handleMaximizeChange);

    return () => {
      window.removeEventListener("resize", handleMaximizeChange);
    };
  }, []);

  const handleMaximize = () => {
    window.electron?.maximize();
  };

  const handleClose = () => {
    window.electron?.hide();
  };

  const draggableEdges = () => {
    return (
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ WebkitAppRegion: "no-drag" }}
      >
        <div
          className="absolute inset-x-0 top-0 h-[8px] cursor-grab hover:cursor-grabbing pointer-events-auto"
          style={{ WebkitAppRegion: "drag" }}
          onDoubleClick={handleMaximize}
        />
        <div
          className="absolute inset-y-0 top-[180px] left-0 w-[8px] cursor-grab hover:cursor-grabbing pointer-events-auto"
          style={{ WebkitAppRegion: "drag" }}
          onDoubleClick={handleMaximize}
        />
        <div
          className="absolute inset-y-0 right-0 w-[8px] cursor-grab hover:cursor-grabbing pointer-events-auto"
          style={{ WebkitAppRegion: "drag" }}
          onDoubleClick={handleMaximize}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[8px] cursor-grab hover:cursor-grabbing pointer-events-auto"
          style={{ WebkitAppRegion: "drag" }}
          onDoubleClick={handleMaximize}
        />
      </div>
    );
  };

  return (
    <>
      {draggableEdges()}
      <div className="flex items-center justify-start gap-2 left-2 top-2 fixed z-50">
        <button
          onClick={handleClose}
          className="w-3 h-3 rounded-full flex justify-center items-center text-muted dark:text-background bg-foreground/10 hover:bg-foreground/25 transition-colors duration-150"
        >
          <X size={8} strokeWidth={3} />
        </button>
        <button
          onClick={handleMaximize}
          className="w-3 h-3 rounded-full flex justify-center items-center text-muted dark:text-background bg-foreground/10 hover:bg-foreground/25 transition-colors duration-150"
        >
          {isMaximized ? (
            <Minus size={8} strokeWidth={3} />
          ) : (
            <ChevronsUpDown size={8} strokeWidth={3} className="-rotate-45" />
          )}
        </button>
      </div>
    </>
  );
}
