import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);

    // Verify the user is properly authenticated
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      // Handle error case
      return NextResponse.redirect(`${requestUrl.origin}/auth/error`);
    }
  }

  // Create a new URL without the code parameter
  const redirectTo = new URL("/", requestUrl.origin);

  return NextResponse.redirect(redirectTo.toString());
}
