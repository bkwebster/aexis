import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard.client";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}
