"use client";

import type { ReactNode } from "react";
import { useAppHotkeys } from "@/hooks/useAppHotkeys";

export const AppHotkeysProvider = ({ children }: { children: ReactNode }) => {
  useAppHotkeys();
  return <>{children}</>;
};
