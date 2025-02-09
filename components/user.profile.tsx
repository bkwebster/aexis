"use client";
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/components/provider.session";
import type React from "react"; // Added import for React
import { ThemeToggle } from "./ui.theme-toggle";

export function UserProfile() {
  const session = useSession();
  const user = session?.user;
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const supabase = useSupabase();

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      setMessage(`Error updating email: ${error.message}`);
    } else {
      setMessage(
        "Email updated successfully. Check your new email for verification."
      );
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(`Error updating password: ${error.message}`);
    } else {
      setMessage("Password updated successfully.");
      setPassword("");
    }
  };

  return (
    <div className="space-y-6">
      <ThemeToggle />
      <form onSubmit={handleUpdateEmail} className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="New Email"
          required
        />
        <Button type="submit">Update Email</Button>
      </form>
      <form onSubmit={handleUpdatePassword} className="space-y-4">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          required
        />
        <Button type="submit">Update Password</Button>
      </form>
      {message && <p className="text-sm text-blue-600">{message}</p>}
    </div>
  );
}
