"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const SessionContext = createContext<Session | null | undefined>(undefined);

export const useSession = () => {
  const session = useContext(SessionContext);
  if (session === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return session;
};

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);
  const supabase = createClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        const {
          data: { session: initialSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (mounted) {
          setSession(initialSession);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize session:", error);
        if (mounted) {
          setSession(null);
          setIsInitialized(true);
        }
      }
    };

    initializeSession();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      console.debug("Auth state change:", { event, newSession });

      // Update session immediately
      setSession(newSession);

      // Handle different auth events
      switch (event) {
        case "SIGNED_IN":
          await queryClient.invalidateQueries();
          router.refresh();
          break;

        case "SIGNED_OUT":
          queryClient.clear();
          router.refresh();
          break;

        case "TOKEN_REFRESHED":
        case "USER_UPDATED":
          await queryClient.invalidateQueries();
          break;
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, queryClient, router]);

  if (!isInitialized) {
    return null;
  }

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
