import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        !request.nextUrl.pathname.startsWith('/guest') &&
        request.nextUrl.pathname !== '/'
    ) {
        // no user, potentially respond by redirecting the user to the login page
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname === '/')) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    // Protect Admin Routes
    // if (request.nextUrl.pathname.startsWith('/dashboard/admin')) {
    //     // We need to check the user's role. 
    //     // Since we can't easily select from the DB here without potentially creating a loop or complex logic,
    //     // we rely on the user metadata if available, OR we accept that the page itself has a second check.
    //     // BUT, for "Defense", we should try to block it here if possible.
    //     // The safest way in middleware without extra DB calls is checking user_metadata if we trust it (we sync it on login/signup).
    //     // Let's assume we sync role to metadata.
    // 
    //     const role = user?.user_metadata?.role
    //     // if (role !== 'admin') {
    //     //     const url = request.nextUrl.clone()
    //     //     url.pathname = '/dashboard'
    //     //     return NextResponse.redirect(url)
    //     // }
    // }

    return supabaseResponse
}
