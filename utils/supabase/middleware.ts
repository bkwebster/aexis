import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set(name, value);
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          supabaseResponse.cookies.set(name, value, options);
        },
        remove(name: string) {
          request.cookies.delete(name);
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          supabaseResponse.cookies.delete(name);
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Auth error:", error);
    return supabaseResponse;
  }

  if (!user) {
    // If no user and trying to access protected route, redirect to login
    const isAuthRoute =
      request.nextUrl.pathname.startsWith("/auth") ||
      request.nextUrl.pathname === "/login";

    const isStaticAsset = request.nextUrl.pathname.match(
      /^\/(_next\/static|_next\/image|favicon\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$)/
    );

    // If not an auth route or static asset, redirect to login
    if (!isAuthRoute && !isStaticAsset) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  } else if (request.nextUrl.pathname === "/login") {
    // If has user and on login page, redirect to home
    const redirectTo = request.nextUrl.searchParams.get("redirect") || "/";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return supabaseResponse;
}
