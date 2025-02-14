import localFont from "next/font/local";
import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import RootProvider from "@/components/provider.root";
import { Toaster } from "sonner";
import WindowControls from "@/components/ui.window.controls";

// Font files can be colocated inside of `app`
const helveticaNow = localFont({
  src: "./Helvetica-Now-Var.woff2",
  display: "swap",
  variable: "--font-helvetica-now",
});

export const metadata: Metadata = {
  title: "AEXIS",
  description: "Plan and schedule",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${helveticaNow.className} ${helveticaNow.variable} antialiased h-screen w-screen overflow-hidden relative`}
      >
        <RootProvider>
          <WindowControls />
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
