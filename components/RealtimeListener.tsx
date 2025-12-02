'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function RealtimeListener() {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase
            .channel('dashboard-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'cases'
                },
                (payload) => {
                    console.log('Change received!', payload)
                    router.refresh()
                    if (payload.eventType === 'INSERT') {
                        toast.info('New case added! Dashboard updated.')
                    } else if (payload.eventType === 'UPDATE') {
                        // Optional: toast.info('Case updated.')
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [router, supabase])

    return null
}
