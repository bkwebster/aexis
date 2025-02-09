"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { AuthError } from "@supabase/supabase-js";

// Simple rate limiting - stores IP addresses and their last attempt times
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  // Clean up old entries
  if (attempt && now - attempt.lastAttempt > WINDOW_MS) {
    loginAttempts.delete(ip);
    return false;
  }

  if (attempt && attempt.count >= MAX_ATTEMPTS) {
    return true;
  }

  return false;
}

function recordAttempt(ip: string) {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
  } else {
    attempt.count += 1;
    attempt.lastAttempt = now;
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const redirectTo = (formData.get("redirectTo") as string) || "/";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      recordAttempt(ip);

      // Provide specific error messages for common cases
      switch (error.message) {
        case "Invalid login credentials":
          return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 }
          );
        case "Email not confirmed":
          return NextResponse.json(
            { error: "Please verify your email address before logging in" },
            { status: 401 }
          );
        default:
          return NextResponse.json(
            { error: error.message },
            { status: error.status || 400 }
          );
      }
    }

    // Clear rate limiting on successful login
    loginAttempts.delete(ip);

    revalidatePath("/", "layout");
    return NextResponse.json({
      success: true,
      redirectTo,
    });
  } catch (err) {
    const error = err as AuthError;
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}
