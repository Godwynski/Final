'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Bell, FileUp, Calendar, AlertCircle } from 'lucide-react'

export default function RealtimeNotifications() {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Subscribe to evidence uploads
        const evidenceChannel = supabase
            .channel('evidence-uploads')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'evidence',
                },
                (payload) => {
                    const evidence = payload.new as any
                    
                    // Only show notification if uploaded by guest (uploaded_by is null)
                    if (!evidence.uploaded_by) {
                        toast.success(
                            <div className="flex items-start gap-3">
                                <FileUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">New Guest Evidence</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {evidence.file_name}
                                    </p>
                                    <button
                                        onClick={() => {
                                            router.push(`/dashboard/cases/${evidence.case_id}`)
                                            toast.dismiss()
                                        }}
                                        className="text-xs text-blue-600 hover:underline mt-1"
                                    >
                                        View Case →
                                    </button>
                                </div>
                            </div>,
                            {
                                duration: 10000,
                                closeButton: true,
                            }
                        )
                    }
                }
            )
            .subscribe()

        // Subscribe to case status changes
        const caseChannel = supabase
            .channel('case-updates')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'cases',
                },
                (payload) => {
                    const oldCase = payload.old as any
                    const newCase = payload.new as any
                    
                    // Only notify on status change
                    if (oldCase.status !== newCase.status) {
                        toast.info(
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">Case Status Updated</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Case #{newCase.case_number}: {oldCase.status} → {newCase.status}
                                    </p>
                                    <button
                                        onClick={() => {
                                            router.push(`/dashboard/cases/${newCase.id}`)
                                            toast.dismiss()
                                        }}
                                        className="text-xs text-blue-600 hover:underline mt-1"
                                    >
                                        View Case →
                                    </button>
                                </div>
                            </div>,
                            {
                                duration: 8000,
                                closeButton: true,
                            }
                        )
                    }
                }
            )
            .subscribe()

        // Subscribe to hearing updates
        const hearingChannel = supabase
            .channel('hearing-updates')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'hearings',
                },
                (payload) => {
                    const hearing = payload.new as any
                    toast.info(
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">New Hearing Scheduled</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {hearing.hearing_type} - {new Date(hearing.hearing_date).toLocaleString()}
                                </p>
                            </div>
                        </div>,
                        {
                            duration: 8000,
                            closeButton: true,
                        }
                    )
                }
            )
            .subscribe()

        // Cleanup subscriptions on unmount
        return () => {
            evidenceChannel.unsubscribe()
            caseChannel.unsubscribe()
            hearingChannel.unsubscribe()
        }
    }, [router, supabase])

    return null // This component doesn't render anything
}
