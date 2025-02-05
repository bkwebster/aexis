"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api";
import UISkeleton from "@/components/ui.skeleton";
import type React from "react"; // Added import for React

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push("/login"); // Redirect to login page if user is not authenticated
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking user:", error);
        router.push("/login");
      }
    };

    checkUser();
  }, [router]);

  if (isLoading) {
    return <UISkeleton />;
  }

  return <>{children}</>;
}
