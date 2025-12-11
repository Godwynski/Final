'use client'

import { useState } from 'react'
import Link from 'next/link'
import AlertModal from '@/components/ui/AlertModal'
import ConfirmModal from '@/components/ui/ConfirmModal'
import ImageModal from '@/components/ui/ImageModal'
import DocumentPreviewModal, { type DocumentType } from '@/components/DocumentPreviewModal'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import CopyButton from '@/components/CopyButton'
import SubmitButton from '@/components/SubmitButton'
import { addInvolvedParty, addCaseNote, deleteCaseNote, generateCaseGuestLink, toggleGuestLinkStatus, emailGuestLink, deleteEvidence } from './actions'
import DashboardEvidenceList from '@/components/DashboardEvidenceList'
import DashboardEvidenceUploadForm from '@/components/DashboardEvidenceUploadForm'
import CaseActionHeader from '@/components/CaseActionHeader'
import CaseTimeline from '@/components/CaseTimeline'
import ResolutionBanner from '@/components/ResolutionBanner'
import ProceedingsTracker from '@/components/ProceedingsTracker'
import { CONFIG } from '@/constants/config'

import { Case, InvolvedParty, Evidence, CaseNote, AuditLog, GuestLink, Hearing, BarangaySettings } from '@/types'

type Tab = 'overview' | 'parties' | 'evidence' | 'notes' | 'activity'

export default function CaseDetailsClient({
    caseData,
    involvedParties,
    evidence,
    notes,
    auditLogs,
    guestLinks,
    hearings = [],
    settings = null
}: {
    caseData: Case,
    involvedParties: InvolvedParty[],
    evidence: Evidence[],
    notes: (CaseNote & { profiles?: { full_name?: string, email?: string } })[], // Join result
    auditLogs: AuditLog[],
    guestLinks: GuestLink[],
    hearings?: Hearing[],
    settings?: BarangaySettings | null
}) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const tabParam = searchParams.get('tab') as Tab
    const activeTab = ['overview', 'parties', 'evidence', 'notes', 'activity'].includes(tabParam) ? tabParam : 'overview'

    const changeTab = (tab: Tab) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', tab)
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    // Determine if case is in a read-only state
    const isReadOnly = ['Dismissed', 'Referred', 'Settled', 'Closed'].includes(caseData.status)

    // Count only image evidence for photo limit
    const imageCount = evidence.filter(e =>
        (CONFIG.FILE_UPLOAD.ALLOWED_IMAGE_TYPES as readonly string[]).includes(e.file_type)
    ).length

// Local derivation of origin (safe with suppressHydrationWarning in this specific context)
    const origin = typeof window !== 'undefined' ? window.location.origin : ''

    // Alert Modal State
    const [alertState, setAlertState] = useState<{
        isOpen: boolean
        title: string
        message: string
        type: 'success' | 'error' | 'info'
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    })

    const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setAlertState({ isOpen: true, title, message, type })
    }

    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }))
    }

    // Confirm Modal State
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean
        message: string
        onConfirm: () => void
    }>({
        isOpen: false,
        message: '',
        onConfirm: () => { }
    })

    const showConfirm = (message: string, onConfirm: () => void) => {
        setConfirmState({ isOpen: true, message, onConfirm })
    }

    const closeConfirm = () => {
        setConfirmState(prev => ({ ...prev, isOpen: false }))
    }

    // Image Modal State
    const [imageModalState, setImageModalState] = useState<{
        isOpen: boolean
        imageUrl: string
        altText: string
    }>({
        isOpen: false,
        imageUrl: '',
        altText: ''
    })

    const showImage = (imageUrl: string, altText: string) => {
        setImageModalState({ isOpen: true, imageUrl, altText })
    }


    const closeImage = () => {
        setImageModalState(prev => ({ ...prev, isOpen: false }))
    }

    // Document Preview Modal State
    const [documentModalState, setDocumentModalState] = useState<{
        isOpen: boolean
        documentType: DocumentType
    }>({
        isOpen: false,
        documentType: 'summons'
    })

    // PIN Visibility State
    const [visiblePins, setVisiblePins] = useState<Record<string, boolean>>({})

    const togglePinVisibility = (id: string) => {
        setVisiblePins(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const openDocumentPreview = (type: DocumentType) => {
        setDocumentModalState({ isOpen: true, documentType: type })
    }

    const closeDocumentPreview = () => {
        setDocumentModalState(prev => ({ ...prev, isOpen: false }))
    }

    // Link Generation Modal State
    const [showLinkModal, setShowLinkModal] = useState(false)



    return (
        <div className="p-4">
            <AlertModal
                isOpen={alertState.isOpen}
                onClose={closeAlert}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            <ConfirmModal
                isOpen={confirmState.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmState.onConfirm}
                message={confirmState.message}
            />

            <ImageModal
                isOpen={imageModalState.isOpen}
                onClose={closeImage}
                imageUrl={imageModalState.imageUrl}
                altText={imageModalState.altText}
            />

            <DocumentPreviewModal
                isOpen={documentModalState.isOpen}
                onClose={closeDocumentPreview}
                documentType={documentModalState.documentType}
                caseData={caseData}
                involvedParties={involvedParties}
                settings={settings}
                evidence={evidence}
                hearings={hearings}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Case #{caseData.case_number}: {caseData.title}</h1>
                        {caseData.incident_type && (
                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                                {caseData.incident_type}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Reported on <span suppressHydrationWarning>{new Date(caseData.incident_date).toLocaleString()}</span> • {caseData.incident_location}
                    </p>
                </div>
                <div className="flex gap-2 print:hidden">
                    <div className="relative group">
                        <button className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700 inline-flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Generate Document
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <button onClick={() => openDocumentPreview('summons')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Summons</button>
                            <button onClick={() => openDocumentPreview('hearing')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Notice of Hearing</button>
                            <button onClick={() => openDocumentPreview('cfa')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Certificate to File Action</button>
                            <button onClick={() => openDocumentPreview('referral')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Referral / Endorsement</button>
                            <button onClick={() => openDocumentPreview('abstract')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Print Abstract</button>
                        </div>
                    </div>
                    {!isReadOnly && (
                        <Link href={`/dashboard/cases/${caseData.id}/edit`} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                            Edit Case
                        </Link>
                    )}
                    {isReadOnly && (
                        <span className="flex items-center gap-2 text-gray-500 bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 cursor-not-allowed" title="Case is closed. Re-open to edit.">
                            🔒 Read Only
                        </span>
                    )}
                </div>
            </div>

            {/* Screen Content (Hidden on print) */}
            <div className="print:hidden">

                {/* Resolution Banner (For Closed/Resolved Cases) */}
                <ResolutionBanner
                    status={caseData.status}
                    resolutionDetails={caseData.resolution_details || null}
                    caseId={caseData.id}
                />

                {/* Action Header */}
                <CaseActionHeader status={caseData.status} caseId={caseData.id} hearings={hearings} />

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                        <li className="me-2">
                            <button onClick={() => changeTab('overview')} className={`inline-flex items-center gap-2 p-4 border-b-2 rounded-t-lg transition-colors ${activeTab === 'overview' ? 'text-blue-600 border-blue-600 bg-blue-50 dark:text-blue-500 dark:border-blue-500 dark:bg-blue-900/20' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Overview
                            </button>
                        </li>
                        <li className="me-2">
                            <button onClick={() => changeTab('parties')} className={`inline-flex items-center gap-2 p-4 border-b-2 rounded-t-lg transition-colors ${activeTab === 'parties' ? 'text-blue-600 border-blue-600 bg-blue-50 dark:text-blue-500 dark:border-blue-500 dark:bg-blue-900/20' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Involved Parties
                            </button>
                        </li>
                        <li className="me-2">
                            <button onClick={() => changeTab('evidence')} className={`inline-flex items-center gap-2 p-4 border-b-2 rounded-t-lg transition-colors ${activeTab === 'evidence' ? 'text-blue-600 border-blue-600 bg-blue-50 dark:text-blue-500 dark:border-blue-500 dark:bg-blue-900/20' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                Evidence
                                {evidence.length > 0 && (
                                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-blue-800 bg-blue-200 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                        {evidence.length}
                                    </span>
                                )}
                            </button>
                        </li>
                        <li className="me-2">
                            <button onClick={() => changeTab('notes')} className={`inline-flex items-center gap-2 p-4 border-b-2 rounded-t-lg transition-colors ${activeTab === 'notes' ? 'text-blue-600 border-blue-600 bg-blue-50 dark:text-blue-500 dark:border-blue-500 dark:bg-blue-900/20' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Notes
                                {notes.length > 0 && (
                                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-blue-800 bg-blue-200 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                        {notes.length}
                                    </span>
                                )}
                            </button>
                        </li>
                        <li className="me-2">
                            <button onClick={() => changeTab('activity')} className={`inline-flex items-center gap-2 p-4 border-b-2 rounded-t-lg transition-colors ${activeTab === 'activity' ? 'text-blue-600 border-blue-600 bg-blue-50 dark:text-blue-500 dark:border-blue-500 dark:bg-blue-900/20' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Activity
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Tab Content */}
                <div>
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column: Facts & Context */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6 space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Facts of the Case</h2>
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{caseData.narrative_facts || caseData.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Proceedings Tracker */}
                            <div className="space-y-6">
                                <ProceedingsTracker
                                    caseId={caseData.id}
                                    hearings={hearings}
                                    isReadOnly={isReadOnly}
                                    involvedParties={involvedParties}
                                />

                                {/* Case Info Metadata */}
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Case Statistics
                                    </h3>
                                    <dl className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                            <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                Parties
                                            </dt>
                                            <dd className="font-bold text-gray-900 dark:text-white">{involvedParties.length}</dd>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                            <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                </svg>
                                                Evidence
                                            </dt>
                                            <dd className="font-bold text-gray-900 dark:text-white">{evidence.length}</dd>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                            <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Hearings
                                            </dt>
                                            <dd className="font-bold text-gray-900 dark:text-white">{hearings.length}</dd>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                            <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Notes
                                            </dt>
                                            <dd className="font-bold text-gray-900 dark:text-white">{notes.length}</dd>
                                        </div>
                                        <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                                            <dt className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Updated</dt>
                                            <dd className="font-medium text-gray-900 dark:text-white text-sm" suppressHydrationWarning>{new Date(caseData.updated_at).toLocaleString()}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PARTIES TAB */}
                    {activeTab === 'parties' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Involved Parties</h2>
                                    {involvedParties.length === 0 ? (
                                        <p className="text-gray-500 italic dark:text-gray-400">No parties added yet.</p>
                                    ) : (
                                        <ul className="space-y-4">
                                            {involvedParties.map(party => (
                                                <li key={party.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <Link href={`/dashboard/people/${encodeURIComponent(party.name)}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                                                {party.name}
                                                            </Link>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">{party.type}</p>
                                                            {party.contact_number && <p className="text-sm text-gray-500 dark:text-gray-400">📞 {party.contact_number}</p>}
                                                            {party.email && <p className="text-sm text-gray-500 dark:text-gray-400">✉️ {party.email}</p>}
                                                            {party.address && <p className="text-sm text-gray-500 dark:text-gray-400">🏠 {party.address}</p>}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Add Party</h3>
                                    {isReadOnly ? (
                                        <p className="text-sm text-gray-500 italic">Case is closed. Re-open to add parties.</p>
                                    ) : (
                                        <form action={addInvolvedParty.bind(null, caseData.id)} className="space-y-4">
                                            <div>
                                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                                <input type="text" name="name" id="name" required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                            </div>
                                            <div>
                                                <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                                                <select name="type" id="type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                    <option value="Complainant">Complainant</option>
                                                    <option value="Respondent">Respondent</option>
                                                    <option value="Witness">Witness</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="contact_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact #</label>
                                                <input
                                                    type="text"
                                                    name="contact_number"
                                                    id="contact_number"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onInput={(e) => {
                                                        const target = e.target as HTMLInputElement;
                                                        target.value = target.value.replace(/[^0-9]/g, '');
                                                    }}
                                                    placeholder="Numbers only"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                            </div>
                                            <div>
                                                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                                <input type="text" name="address" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                            </div>
                                            <SubmitButton className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" loadingText="Adding Party...">
                                                Add Party
                                            </SubmitButton>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* EVIDENCE TAB */}
                    {activeTab === 'evidence' && (
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Evidence</h2>
                                    <button
                                        onClick={() => router.refresh()}
                                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                        Refresh
                                    </button>
                                </div>
                                <DashboardEvidenceList
                                    evidence={evidence}
                                    caseId={caseData.id}
                                    onViewImage={(url) => showImage(url, 'Evidence Preview')}
                                    onDelete={async (id) => {
                                        if (isReadOnly) {
                                            showAlert('Action Denied', 'Cannot delete evidence in a closed case.', 'error')
                                            return
                                        }
                                        showConfirm('Are you sure you want to delete this evidence? This action cannot be undone.', async () => {
                                            const result = await deleteEvidence(caseData.id, id)
                                            if (result?.error) showAlert('Error', result.error, 'error')
                                        })
                                    }}
                                />

                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Upload New Evidence</h3>
                                    {isReadOnly ? (
                                        <p className="text-sm text-gray-500 italic">Case is closed. Re-open to upload evidence.</p>
                                    ) : (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                            <DashboardEvidenceUploadForm caseId={caseData.id} currentPhotoCount={imageCount} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Guest Upload Links</h2>
                                    {!isReadOnly && (
                                        <button
                                            type="button"
                                            onClick={() => setShowLinkModal(true)}
                                            className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800 inline-flex items-center gap-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                            Generate Link
                                        </button>
                                    )}
                                </div>

                                {/* Generate Link Modal */}
                                {showLinkModal && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                                        <div
                                            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {/* Modal Header */}
                                            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                                        </svg>
                                                        Generate Guest Link
                                                    </h3>
                                                    <button
                                                        onClick={() => setShowLinkModal(false)}
                                                        className="text-white/80 hover:text-white transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                                <p className="text-white/90 text-sm mt-1">Create a secure upload link for a recipient</p>
                                            </div>

                                            {/* Modal Body */}
                                            <form
                                                action={async (formData) => {
                                                    const result = await generateCaseGuestLink(caseData.id, formData)
                                                    if (result?.error) {
                                                        showAlert('Error', result.error, 'error')
                                                    } else if (result?.success) {
                                                        // Always close modal after successful generation
                                                        setShowLinkModal(false)
                                                        // Add limit warning if applicable
                                                        const message = result.closeModal 
                                                            ? result.message + ' (Maximum limit of 5 links reached)'
                                                            : result.message
                                                        showAlert('Link Generated', message, 'success')
                                                    }
                                                }}
                                                className="p-6 space-y-4"
                                            >
                                                <div>
                                                    <label htmlFor="recipient_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                        Recipient Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="recipient_name"
                                                        id="recipient_name"
                                                        placeholder="e.g. Juan Dela Cruz"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="recipient_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                        Recipient Email
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 font-normal">(auto-sends link)</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="recipient_email"
                                                        id="recipient_email"
                                                        placeholder="email@example.com"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="recipient_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                        Recipient Phone
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="recipient_phone"
                                                        id="recipient_phone"
                                                        placeholder="09xxxxxxxxx"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                                    />
                                                </div>

                                                <div className="pt-2 space-y-3">
                                                    <SubmitButton
                                                        className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800 inline-flex items-center justify-center gap-2"
                                                        loadingText="Generating..."
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                                        </svg>
                                                        Generate Secure Link
                                                    </SubmitButton>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                                        Max {CONFIG.GUEST_LINK.MAX_LINKS_PER_CASE} active links per case
                                                    </p>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                {guestLinks.length === 0 && <p className="text-sm text-gray-500 italic dark:text-gray-400">No links generated yet.</p>}
                                <div className="grid gap-4">
                                    {guestLinks.map(link => (
                                        <div key={link.id} className={`rounded-xl border shadow-sm transition-all ${link.is_active ? 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700' : 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 opacity-75'}`}>
                                            {/* Header Portion */}
                                            <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${link.is_active ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                            {link.recipient_name || 'Guest User'}
                                                            {!link.is_active && <span className="text-[10px] uppercase font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full dark:bg-red-900/30 dark:text-red-400">Inactive</span>}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                            {link.recipient_email ? (
                                                                <>
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                                    {link.recipient_email}
                                                                </>
                                                            ) : link.recipient_phone ? (
                                                                <>
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                                    {link.recipient_phone}
                                                                </>
                                                            ) : 'No contact info'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                                    {link.is_active && (
                                                        <a href={`/guest/${link.token}`} target="_blank" className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline dark:text-blue-400 flex items-center gap-1">
                                                            Open Link
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                                        </a>
                                                    )}
                                                    <form action={async () => {
                                                        if (isReadOnly) return;
                                                        const result = await toggleGuestLinkStatus(link.id, link.is_active, caseData.id)
                                                        if (result?.error) showAlert('Error', result.error, 'error')
                                                    }}>
                                                        <SubmitButton
                                                            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${link.is_active ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20' : 'border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/30 dark:text-green-400 dark:hover:bg-green-900/20'} ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            loadingText="..."
                                                            disabled={isReadOnly}
                                                        >
                                                            {link.is_active ? 'Deactivate' : 'Re-activate'}
                                                        </SubmitButton>
                                                    </form>
                                                </div>
                                            </div>

                                            {/* Details Portion */}
                                            <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-xl space-y-3">
                                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1">
                                                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">URL</span>
                                                        <span className="font-mono text-blue-600 dark:text-blue-400 truncate max-w-[150px] sm:max-w-xs block">
                                                            .../guest/{link.token.slice(0, 8)}...
                                                        </span>
                                                        <CopyButton text={`/guest/${link.token}`} label="" />
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1">
                                                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">PIN</span>
                                                        <span className="font-mono font-bold text-gray-700 dark:text-gray-200 min-w-[3ch] text-center">
                                                            {visiblePins[link.id] ? link.pin : '•••'}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => togglePinVisibility(link.id)}
                                                            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                                                            title={visiblePins[link.id] ? "Hide PIN" : "Show PIN"}
                                                        >
                                                            {visiblePins[link.id] ? (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                            )}
                                                        </button>
                                                        <div className="border-l border-gray-200 dark:border-gray-700 pl-2 ml-1">
                                                            <CopyButton text={link.pin} label="" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 ml-auto">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        Expires: <span suppressHydrationWarning>{new Date(link.expires_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                {/* Email Sender */}
                                                {link.is_active && (
                                                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50">
                                                        <form action={emailGuestLink} className="flex gap-2 items-center">
                                                            <input type="hidden" name="link" value={`${origin}/guest/${link.token}`} suppressHydrationWarning />
                                                            <input type="hidden" name="pin" value={link.pin} />
                                                            <input type="hidden" name="caseId" value={caseData.id} />
                                                            <div className="relative flex-1 max-w-sm">
                                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                                    <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                                                        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                                                                        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                                                                    </svg>
                                                                </div>
                                                                <input
                                                                    type="email"
                                                                    name="email"
                                                                    placeholder="Send link to email..."
                                                                    defaultValue={link.recipient_email || ''}
                                                                    required
                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                />
                                                            </div>
                                                            <SubmitButton className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-xs px-3 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800" loadingText="Sending...">
                                                                Send
                                                            </SubmitButton>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NOTES TAB */}
                    {activeTab === 'notes' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Case Notes & Timeline</h2>
                                    <div className="space-y-6">
                                        {notes.map(note => (
                                            <div key={note.id} className="border-l-4 border-blue-500 pl-4 py-1 group relative">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap flex-1">{note.content}</p>
                                                    <button
                                                        onClick={async () => {
                                                            if (isReadOnly) {
                                                                showAlert('Action Denied', 'Cannot delete notes in a closed case.', 'error')
                                                                return
                                                            }
                                                            showConfirm('Are you sure you want to delete this note?', async () => {
                                                                const result = await deleteCaseNote(caseData.id, note.id)
                                                                if (result?.error) showAlert('Error', result.error, 'error')
                                                            })
                                                        }}
                                                        className={`opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 ml-2 ${isReadOnly ? 'cursor-not-allowed' : ''}`}
                                                        title="Delete Note"
                                                        disabled={isReadOnly}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                                                    By {note.profiles?.full_name || note.profiles?.email || 'Unknown'} on <span suppressHydrationWarning>{new Date(note.created_at).toLocaleString()}</span>
                                                </p>
                                            </div>
                                        ))}
                                        {notes.length === 0 && <p className="text-gray-500 italic dark:text-gray-400">No notes added yet.</p>}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Add Note</h3>
                                    {isReadOnly ? (
                                        <p className="text-sm text-gray-500 italic">Case is closed. Re-open to add notes.</p>
                                    ) : (
                                        <form
                                            action={async (formData) => {
                                                const result = await addCaseNote(caseData.id, formData)
                                                if (result?.error) {
                                                    showAlert('Error', result.error, 'error')
                                                } else {
                                                    // Reset the textarea
                                                    const form = document.getElementById('add-note-form') as HTMLFormElement
                                                    if (form) form.reset()
                                                }
                                            }}
                                            id="add-note-form"
                                            className="space-y-4"
                                        >
                                            <div>
                                                <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Note Content</label>
                                                <textarea name="content" id="content" rows={4} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                                            </div>
                                            <SubmitButton className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" loadingText="Adding Note...">
                                                Add Note
                                            </SubmitButton>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ACTIVITY TAB */}
                    {activeTab === 'activity' && (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Case Timeline</h2>
                            <CaseTimeline
                                caseData={caseData}
                                notes={notes}
                                auditLogs={auditLogs}
                                evidence={evidence}
                                onViewImage={(url) => showImage(url, 'Timeline Image')}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
