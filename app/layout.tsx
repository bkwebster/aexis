import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import SessionProvider from "@/components/session-provider";
import { AppHotkeysProvider } from "@/components/hotkeys-provider";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UIHeader from "@/components/ui.header";
import UISidebar from "@/components/ui.sidebar";
import UISkeleton from "@/components/ui.skeleton";
import { AuthProvider } from "@/components/auth.provider";

const queryClient = new QueryClient();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AEXIS",
  description: "Plan and schedule",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <AuthProvider>
              <AppHotkeysProvider>
                <UIHeader />
                <UISidebar />
                <Suspense fallback={<UISkeleton />}>{children}</Suspense>
              </AppHotkeysProvider>
            </AuthProvider>
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
