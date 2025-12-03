import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
    points: 20, // 20 requests
    duration: 1, // per 1 second
})

export async function proxy(request: NextRequest) {
    try {
        // Simple IP-based rate limiting
        // Note: In a real edge environment, this memory cache is per-isolate.
        // For distributed rate limiting, use Redis or similar.
        const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1'
        await rateLimiter.consume(ip)
    } catch {
        return new NextResponse('Too Many Requests', { status: 429 })
    }

    return await updateSession(request)
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
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
