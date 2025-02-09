"use client";

import { Auth } from "@/components/auth.entry";
import { useSession } from "@/components/provider.session";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const session = useSession();

  if (session) {
    redirect("/");
  }

  return <Auth />;
}
