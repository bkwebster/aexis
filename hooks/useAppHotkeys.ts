"use client";

import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useTheme } from "@/hooks/useTheme";

export const useAppHotkeys = () => {
  const router = useRouter();
  const { toggleTheme } = useTheme();

  const navigateToDashboard = useCallback(() => {
    router.push("/");
  }, [router]);

  const navigateToTasks = useCallback(() => {
    router.push("/tasks");
  }, [router]);

  const toggleDarkMode = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  // Define your hotkeys here
  useHotkeys("shift+d", navigateToDashboard, { enableOnFormTags: true });
  useHotkeys("shift+t", navigateToTasks, { enableOnFormTags: true });
  useHotkeys("shift+m", toggleDarkMode, { enableOnFormTags: true });

  // Return any functions or values that components might need
  return {
    navigateToDashboard,
    navigateToTasks,
    toggleDarkMode,
  };
};
