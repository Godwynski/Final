import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

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

        const { browser, os, deviceType } = parseUserAgent(userAgent)

        // Base visit data
        const visitData = {
            ip_address: ip,
            user_agent: userAgent,
            page_path: body.page || '/',
            referrer,
            browser,
            os,
            device_type: deviceType,
            session_id: sessionId,
        }

        // Always record page view
        const { error: pageViewError } = await supabase
            .from('site_visits')
            .insert({
                ...visitData,
                visit_type: 'page_view',
            })

        if (pageViewError) {
            console.error('Error tracking page view:', pageViewError)
        }

        // Record session start if new session
        if (isNewSession) {
            const { error: sessionError } = await supabase
                .from('site_visits')
                .insert({
                    ...visitData,
                    visit_type: 'session',
                })

            if (sessionError) {
                console.error('Error tracking session:', sessionError)
            }
        }

        // Record unique daily visit if first visit today
        if (isNewDailyVisit) {
            const { error: dailyError } = await supabase
                .from('site_visits')
                .insert({
                    ...visitData,
                    visit_type: 'unique_daily',
                })

            if (dailyError) {
                console.error('Error tracking daily unique:', dailyError)
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in track-visit API:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
