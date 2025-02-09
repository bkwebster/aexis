"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SessionProvider from "@/components/provider.session";
import { AppHotkeysProvider } from "@/components/provider.hotkeys";
import { ThemeProvider } from "@/components/provider.theme";
import { useState } from "react";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <AppHotkeysProvider>{children}</AppHotkeysProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
