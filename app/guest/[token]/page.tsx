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
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {caseData.description}
                            </p>
                        </div>
                    </div>
                </div>

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
