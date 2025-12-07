'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Generate a unique session ID
function getOrCreateSessionId(): string {
    const SESSION_KEY = 'visit_session_id'
    let sessionId = sessionStorage.getItem(SESSION_KEY)
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
        sessionStorage.setItem(SESSION_KEY, sessionId)
    }
    return sessionId
}

// Check if this is a new session
function isNewSession(): boolean {
    const SESSION_KEY = 'visit_session_tracked'
    if (sessionStorage.getItem(SESSION_KEY)) {
        return false
    }
    sessionStorage.setItem(SESSION_KEY, 'true')
    return true
}

// Check if this is a unique daily visit (per IP - handled server-side)
function getDailyVisitKey(): string {
    const today = new Date().toISOString().split('T')[0]
    return `daily_visit_${today}`
}

function isNewDailyVisit(): boolean {
    const key = getDailyVisitKey()
    if (localStorage.getItem(key)) {
        return false
    }
    localStorage.setItem(key, 'true')
    // Clean up old daily keys
    for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i)
        if (storageKey?.startsWith('daily_visit_') && storageKey !== key) {
            localStorage.removeItem(storageKey)
        }
    }
    return true
}

export default function VisitTracker() {
    const pathname = usePathname()
    const lastTrackedPath = useRef<string | null>(null)

    useEffect(() => {
        // Prevent duplicate tracking for the same path in quick succession
        if (lastTrackedPath.current === pathname) return
        lastTrackedPath.current = pathname

        const trackVisit = async () => {
            try {
                const sessionId = getOrCreateSessionId()
                const isSession = isNewSession()
                const isUniqueDaily = isNewDailyVisit()

                await fetch('/api/track-visit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        page: pathname,
                        referrer: document.referrer || null,
                        sessionId,
                        isNewSession: isSession,
                        isNewDailyVisit: isUniqueDaily,
                    }),
                })
            } catch (error) {
                // Silently fail - don't disrupt user experience
                console.debug('Visit tracking failed:', error)
            }
        }

        trackVisit()
    }, [pathname])

    // This component doesn't render anything
    return null
}
