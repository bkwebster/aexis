"use client";

import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useAppHotkeys = () => {
  const router = useRouter();

  const navigateToDashboard = useCallback(() => {
    router.push("/");
  }, [router]);

  const navigateToTasks = useCallback(() => {
    router.push("/tasks");
  }, [router]);

  const toggleDarkMode = useCallback(() => {
    // Implement dark mode toggle logic here
    console.log("Toggling dark mode");
  }, []);

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
