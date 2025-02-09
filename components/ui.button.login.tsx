"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LoginButton() {
  const router = useRouter();

  return (
    <Button variant="default" onClick={() => router.push("/login")}>
      Sign In
    </Button>
  );
}
