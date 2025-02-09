"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabase } from "@/hooks/useSupabase";
import { useMutation } from "@tanstack/react-query";
import type { AuthError } from "@supabase/supabase-js";

interface AuthFormData {
  email: string;
  password: string;
}

export function Auth({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const supabase = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const signUpMutation = useMutation({
    mutationFn: async (data: AuthFormData) => {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    },
    onError: (error: AuthError) => {
      setMessage(`Error signing up: ${error.message}`);
    },
    onSuccess: () => {
      setMessage("Check your email for the confirmation link.");
      setEmail("");
      setPassword("");
    },
  });

  const signInMutation = useMutation({
    mutationFn: async (data: AuthFormData) => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("redirectTo", redirectTo);

      const response = await fetch("/auth/login", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to sign in");
      }

      // After successful server-side auth, explicitly get the session
      const { error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      // Trigger an auth state change to update the UI immediately
      await supabase.auth.refreshSession();

      return result;
    },
    onError: (error: Error) => {
      setMessage(`Error signing in: ${error.message}`);
    },
    onSuccess: async (result) => {
      // Wait for session to be updated before redirecting
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.push(result.redirectTo || redirectTo);
    },
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    signUpMutation.mutate({ email, password });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    signInMutation.mutate({ email, password });
  };

  const isLoading = signUpMutation.isPending || signInMutation.isPending;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={isLoading}
              />
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <Button
              type="button"
              onClick={handleSignUp}
              variant="outline"
              disabled
            >
              Account creation is disabled.
            </Button>
            {message && (
              <p className="mt-4 text-sm text-center text-destructive">
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
