"use client";

import { Suspense, lazy } from "react";

const ClientDashboard = lazy(() => import("./client"));

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ClientDashboard />
      </Suspense>
    </div>
  );
}
