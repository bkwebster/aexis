"use client";

import { useSupabase } from "@/hooks/useSupabase";
import { useQueryClient } from "@tanstack/react-query";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

export function LogoutButton({ variant }: { variant?: "ghost" }) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      // First clear all query cache and reset queries
      queryClient.clear();
      queryClient.resetQueries();

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      router.push("/login");
      router.refresh();
    },
    onError: (error) => {
      handleError(error);
    },
  });

  return (
    <div
      onClick={() => mutation.mutate()}
      className={cn(
        "cursor-pointer",
        variant === "ghost" &&
          "hover:text-foreground transition-colors duration-120"
      )}
    >
      <div className="flex">
        <LogOut size={16} />
        {mutation.isPending ? "Signing out..." : "Sign Out"}
      </div>
    </div>
  );
}
