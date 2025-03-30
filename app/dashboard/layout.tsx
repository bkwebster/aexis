"use client";

import UIHeader from "@/components/ui.header";
import UISidebar from "@/components/ui.sidebar";
import { Suspense } from "react";
import UISkeleton from "@/components/ui.skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <UIHeader />
      <div className="flex-1 flex">
        <UISidebar />
        <main className="flex-1 p-8">
          <Suspense fallback={<UISkeleton />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
