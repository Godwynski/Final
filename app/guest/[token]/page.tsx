import { createAdminClient } from '@/utils/supabase/admin'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import Image from 'next/image'
import PinEntryForm from './pin-form'
import GuestUploadForm from './GuestUploadForm'
import GuestEvidenceList from './GuestEvidenceList'
import { CONFIG } from '@/constants/config'

export default async function GuestPage(props: { params: Promise<{ token: string }> }) {
    const params = await props.params
    const { token } = params
    const supabaseAdmin = createAdminClient()

    // 1. Fetch Link Details (Bypass RLS to check validity)
    const { data: link, error } = await supabaseAdmin
        .from('guest_links')
        .select('*, cases(*)')
        .eq('token', token)
        .single()

    if (error || !link) {
        return notFound()
    }

    const isExpired = new Date(link.expires_at) < new Date()
    const terminalStatuses = ['Closed', 'Settled', 'Dismissed', 'Referred']
    const isCaseClosed = terminalStatuses.includes(link.cases.status)

    if (isExpired || !link.is_active || isCaseClosed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="p-8 text-center bg-white rounded-lg shadow dark:bg-gray-800 max-w-md w-full">
                    <div className="mb-4 text-red-500">
                        {isCaseClosed ? (
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        ) : (
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        )}
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                        {isCaseClosed ? 'Case Closed' : 'Access Expired'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {isCaseClosed
                            ? 'This case has been closed or settled. No further evidence can be uploaded.'
                            : 'This guest link has expired or is no longer active. Please contact the administrator for a new link.'}
                    </p>
                </div>
            </div>
        )
    }

    // 2. Check PIN Cookie
    const cookieStore = await cookies()
    const pinCookie = cookieStore.get(`guest_pin_${token}`)

    if (!pinCookie || pinCookie.value !== link.pin) {
        return <PinEntryForm token={token} />
    }

    // 3. Fetch Evidence (Authenticated via PIN)
    const { data: allEvidence } = await supabaseAdmin
        .from('evidence')
        .select('*')
        .eq('case_id', link.case_id)
        .order('created_at', { ascending: false })

    // 4. Fetch Hearings (Upcoming)
    const { data: hearings } = await supabaseAdmin
        .from('hearings')
        .select('*')
        .eq('case_id', link.case_id)
        .gte('hearing_date', new Date().toISOString())
        .order('hearing_date', { ascending: true })
        .limit(1)

    const nextHearing = hearings?.[0]

    // Filter evidence for guest visibility:
    // - Staff uploads (uploaded_by is not null)
    // - Own uploads (guest_link_id matches this link)
    // - Other guests' uploads where is_visible_to_others = true
    const visibleEvidence = allEvidence?.filter(e =>
        e.uploaded_by !== null ||                     // Staff uploads
        e.guest_link_id === link.id ||                // Own uploads
        e.is_visible_to_others === true               // Other guests (if public)
    ) || []

    // Count only image evidence for THIS LINK's photo limit
    const linkPhotoCount = allEvidence?.filter(e =>
        e.guest_link_id === link.id &&
        CONFIG.FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(e.file_type as any)
    ).length || 0

    const caseData = link.cases

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Card */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                    <div className="bg-blue-700 px-6 py-4 dark:bg-blue-900">
                        <div className="flex justify-between items-center text-white">
                            <div className="flex items-center">
                                <Image
                                    src="/logo.png"
                                    alt="Blotter System Logo"
                                    width={40}
                                    height={40}
                                    className="mr-3"
                                />
                                <h1 className="text-2xl font-bold">Guest Access Portal</h1>
                            </div>
                            <span className="text-sm bg-blue-600 px-3 py-1 rounded-full dark:bg-blue-800 border border-blue-500 dark:border-blue-700">
                                Expires: {new Date(link.expires_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{caseData.title}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Case #{caseData.case_number} • {new Date(caseData.incident_date).toLocaleDateString()} • {caseData.incident_location}
                                </p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border ${caseData.status === 'New' ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800' :
                                caseData.status === 'Settled' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800' :
                                    'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800'
                                }`}>
                                {caseData.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Incident Narrative Card */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gray-50/50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                        <h3 className="flex items-center gap-2.5 text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                            <div className="p-1.5 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-md">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            Incident Narrative
                        </h3>
                        {caseData.incident_type && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold border border-gray-200 dark:border-gray-600">
                                {caseData.incident_type}
                            </span>
                        )}
                    </div>
                    <div className="p-6 md:p-8">
                        <div className="prose prose-lg prose-blue dark:prose-invert max-w-none">
                            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {(caseData.description || "No narrative provided for this case.").replace(/^\[.*?\]\s*/, '')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Upcoming Hearing Card (Moved out of header if it was there, or keep separate) */}
                {nextHearing && (
                    <div className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 border-l-4 border-blue-500 rounded-r-lg shadow-sm p-6 flex items-start gap-5">
                        <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-800 rounded-xl text-blue-600 dark:text-blue-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                                Upcoming Hearing
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                                <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    {new Date(nextHearing.hearing_date).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                                <span className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                                    {new Date(nextHearing.hearing_date).toLocaleTimeString(undefined, {
                                        hour: 'numeric',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {nextHearing.location || 'Location TBD'}
                            </p>
                        </div>
                    </div>
                )}



                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Evidence List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Case Evidence</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{visibleEvidence.length} items</span>
                        </div>
                        <GuestEvidenceList evidence={visibleEvidence} token={token} />
                    </div>

                    {/* Right Column: Upload Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 sticky top-8">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload New Evidence</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Securely upload images related to this case.
                                </p>
                            </div>
                            <div className="p-6">
                                <GuestUploadForm token={token} currentPhotoCount={linkPhotoCount} />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}
