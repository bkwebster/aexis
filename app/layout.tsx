import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import RootProvider from "@/components/provider.root";
import { Toaster } from "sonner";
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen overflow-hidden relative`}
      >
        <RootProvider>
          {children}
          <Toaster
            position="bottom-left"
            closeButton
            richColors
            duration={2000}
          />
        </RootProvider>
      </body>
    </html>
  );
}
