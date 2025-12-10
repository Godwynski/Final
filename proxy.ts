import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { requiresSessionValidation } from "./utils/route-helpers";

const rateLimiter = new RateLimiterMemory({
  points: 20, // 20 requests
  duration: 1, // per 1 second
});

export async function proxy(request: NextRequest) {
  try {
    // Simple IP-based rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    await rateLimiter.consume(ip);
  } catch {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  // OPTIMIZATION: Non-blocking session update for public/guest routes
  const pathname = request.nextUrl.pathname;
  
  if (!requiresSessionValidation(pathname)) {
    // For public routes, update session async (fire-and-forget)
    // This prevents blocking the request while session is validated
    updateSession(request).catch((error) => {
      // Silent fail - session update is not critical for public routes
      console.error('Background session update failed:', error);
    });
    
    return NextResponse.next();
  }

  // For protected routes (dashboard, etc.), still wait for session validation
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
