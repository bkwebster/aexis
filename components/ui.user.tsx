"use client";

import { useSession } from "@/components/provider.session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
export default function UIUser() {
  const session = useSession();
  const router = useRouter();
  const user = session?.user;

  const userInitials = user?.email
    ? user.email
        .split("@")[0]
        .split(".")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const handleLogout = () => {
    router.push("/login");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        <Avatar className="h-5 w-5 text-xs bg-border">
          <AvatarFallback className="bg-foreground text-background">
            {userInitials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-transparent border-0">
        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="cursor-pointer bg-transparent border-0"
        >
          <User size={14} />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer bg-transparent border-0"
          onClick={() => handleLogout()}
        >
          <LogOut size={14} className="cursor-pointer" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
