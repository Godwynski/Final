import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory cache for guest link data (5-minute TTL)
const guestLinkCache = new Map<string, { data: any; expiry: number }>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Parse user agent to extract browser and OS
function parseUserAgent(ua: string) {
    let browser = 'Unknown'
    let os = 'Unknown'
    let deviceType = 'Desktop'

    // Detect browser
    if (ua.includes('Firefox')) browser = 'Firefox'
    else if (ua.includes('Edg')) browser = 'Edge'
    else if (ua.includes('Chrome')) browser = 'Chrome'
    else if (ua.includes('Safari')) browser = 'Safari'
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera'

    // Detect OS
    if (ua.includes('Windows NT 10')) os = 'Windows 10'
    else if (ua.includes('Windows NT 11') || (ua.includes('Windows NT 10') && ua.includes('Win64'))) os = 'Windows 11'
    else if (ua.includes('Windows')) os = 'Windows'
    else if (ua.includes('Mac OS X')) os = 'macOS'
    else if (ua.includes('Linux')) os = 'Linux'
    else if (ua.includes('Android')) os = 'Android'
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

    // Detect device type
    if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) {
        deviceType = 'Mobile'
    } else if (ua.includes('iPad') || ua.includes('Tablet')) {
        deviceType = 'Tablet'
    }

    return { browser, os, deviceType }
}

// Get cached guest link data
function getCachedGuestLink(token: string) {
    const cached = guestLinkCache.get(token);
    if (cached && cached.expiry > Date.now()) {
        return cached.data;
    }
    // Clean up expired entry
    if (cached) {
        guestLinkCache.delete(token);
    }
    return null;
}

// Cache guest link data
function cacheGuestLink(token: string, data: any) {
    guestLinkCache.set(token, {
        data,
        expiry: Date.now() + CACHE_TTL
    });
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'Unknown'
        const userAgent = request.headers.get('user-agent') || ''
        const referrer = request.headers.get('referer') || body.referrer || null
        const sessionId = body.sessionId || null
        const isNewSession = body.isNewSession || false
        const isNewDailyVisit = body.isNewDailyVisit || false
        const pagePath = body.page || '/'

        const { browser, os, deviceType } = parseUserAgent(userAgent)

        // Identify Visitor
        let userId = null
        let visitorEmail = null
        let visitorName = null
        let visitorRole = 'anonymous'

        // OPTIMIZATION: Check for auth cookie before making DB call
        const hasAuthCookie = request.cookies.get('sb-access-token') || 
                             request.cookies.get('sb-refresh-token')

        // 1. Check for Authenticated User (only if has auth cookie)
        if (hasAuthCookie) {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                userId = user.id
                visitorEmail = user.email
                visitorName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
                visitorRole = 'authenticated'
            }
        }

        // 2. Check for Guest Context (if not authenticated)
        if (visitorRole === 'anonymous' && pagePath.startsWith('/guest/')) {
            const token = pagePath.split('/guest/')[1]?.split('/')[0]
            if (token) {
                // OPTIMIZATION: Try cache first
                let guestLink = getCachedGuestLink(token)
                
                if (!guestLink) {
                    // Cache miss - fetch from database
                    const adminClient = createAdminClient()
                    const { data } = await adminClient
                        .from('guest_links')
                        .select('recipient_name, recipient_email')
                        .eq('token', token)
                        .single()

                    if (data) {
                        cacheGuestLink(token, data)
                        guestLink = data
                    }
                }

                if (guestLink) {
                    visitorName = guestLink.recipient_name || 'Guest'
                    visitorEmail = guestLink.recipient_email
                    visitorRole = 'guest'
                }
            }
        }

        // Base visit data
        const visitData = {
            ip_address: ip,
            user_agent: userAgent,
            page_path: pagePath,
            referrer,
            browser,
            os,
            device_type: deviceType,
            session_id: sessionId,
            user_id: userId,
            visitor_email: visitorEmail,
            visitor_name: visitorName,
            visitor_role: visitorRole,
        }

        // OPTIMIZATION: Batch all inserts into a single database call
        const insertRecords = [
            // Always record page view
            {
                ...visitData,
                visit_type: 'page_view' as const,
            }
        ]

        // Add session record if new session
        if (isNewSession) {
            insertRecords.push({
                ...visitData,
                visit_type: 'session' as const,
            })
        }

        // Add unique daily record if first visit today
        if (isNewDailyVisit) {
            insertRecords.push({
                ...visitData,
                visit_type: 'unique_daily' as const,
            })
        }

        // Single batch insert instead of 3 sequential inserts
        const { error: batchError } = await supabase
            .from('site_visits')
            .insert(insertRecords)

        if (batchError) {
            console.error('Error tracking visits:', batchError)
            // Return success anyway - don't block user experience
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in track-visit API:', error)
        // Return success to avoid blocking user experience
        return NextResponse.json({ success: true })
    }
}
