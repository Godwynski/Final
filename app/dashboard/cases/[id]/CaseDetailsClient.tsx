'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AlertModal from '@/components/ui/AlertModal'
import ConfirmModal from '@/components/ui/ConfirmModal'
import ImageModal from '@/components/ui/ImageModal'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import CopyButton from '@/components/CopyButton'
import SubmitButton from '@/components/SubmitButton'
import { addInvolvedParty, addCaseNote, deleteCaseNote, generateCaseGuestLink, toggleGuestLinkStatus, emailGuestLink, updateActionTaken, deleteEvidence } from './actions'
import DashboardEvidenceList from '@/components/DashboardEvidenceList'
import DashboardEvidenceUploadForm from '@/components/DashboardEvidenceUploadForm'
import CaseActionHeader from '@/components/CaseActionHeader'
import CaseTimeline from '@/components/CaseTimeline'
import ResolutionBanner from '@/components/ResolutionBanner'
import ProceedingsTracker from '@/components/ProceedingsTracker'

type Tab = 'overview' | 'parties' | 'evidence' | 'notes' | 'activity'

export default function CaseDetailsClient({
    caseData,
    involvedParties,
    evidence,
    notes,
    auditLogs,
    guestLinks,
    userRole,
    userId,
    hearings = [],
    settings = null
}: {
    caseData: any,
    involvedParties: any[],
    evidence: any[],
    notes: any[],
    auditLogs: any[],
    guestLinks: any[],
    userRole: string,
    userId: string,
    hearings?: any[],
    settings?: any
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

    const [formattedDate, setFormattedDate] = useState<string>('')
    const [origin, setOrigin] = useState<string>('')

    const [generatedDate, setGeneratedDate] = useState<string>('')

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
        title: string
        message: string
        onConfirm: () => void
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { }
    })

    const showConfirm = (title: string, message: string, onConfirm: () => void) => {
        setConfirmState({ isOpen: true, title, message, onConfirm })
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

    // Format date on client only to avoid hydration mismatch
    useEffect(() => {
        setFormattedDate(new Date(caseData.incident_date).toLocaleString())
        setOrigin(window.location.origin)
        setGeneratedDate(new Date().toLocaleString())
    }, [caseData.incident_date])

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
                title={confirmState.title}
                message={confirmState.message}
            />

            <ImageModal
                isOpen={imageModalState.isOpen}
                onClose={closeImage}
                imageUrl={imageModalState.imageUrl}
                altText={imageModalState.altText}
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
                        Reported on {formattedDate || new Date(caseData.incident_date).toISOString().slice(0, 10)} • {caseData.incident_location}
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
                            <a href={`/dashboard/cases/${caseData.id}/print?form=summons`} target="_blank" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Summons</a>
                            <a href={`/dashboard/cases/${caseData.id}/print?form=hearing`} target="_blank" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Notice of Hearing</a>
                            <a href={`/dashboard/cases/${caseData.id}/print?form=cfa`} target="_blank" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Certificate to File Action</a>
                            <a href={`/dashboard/cases/${caseData.id}/print?form=referral`} target="_blank" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Referral / Endorsement</a>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            window.print()
                        }}
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700 inline-flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Abstract
                    </button>
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

            {/* Printable Abstract (Visible only on print) */}
            <div className="hidden print:block bg-white text-black p-8 max-w-[210mm] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-4">
                    <div className="w-24 h-24 flex items-center justify-center border border-gray-300 rounded-full overflow-hidden relative">
                        {settings?.logo_barangay_url ? (
                            <img src={settings.logo_barangay_url} alt="Barangay Logo" className="w-full h-full object-contain" />
                        ) : (
                            <span className="text-xs text-center text-gray-500">Barangay Logo</span>
                        )}
                    </div>
                    <div className="text-center flex-1">
                        <h1 className="text-xl font-bold uppercase tracking-wide">Republic of the Philippines</h1>
                        <p className="text-sm uppercase">Province of {settings?.province || '[Province Name]'}</p>
                        <p className="text-sm uppercase">City/Municipality of {settings?.city_municipality || '[City Name]'}</p>
                        <h2 className="text-2xl font-black uppercase mt-2">Barangay {settings?.barangay_name || '[Barangay Name]'}</h2>
                        <h3 className="text-lg font-bold uppercase mt-4 border-2 border-black inline-block px-4 py-1">Blotter Extract</h3>
                    </div>
                    <div className="w-24 h-24 flex items-center justify-center border border-gray-300 rounded-full overflow-hidden relative">
                        {settings?.logo_city_url ? (
                            <img src={settings.logo_city_url} alt="City/Muni Logo" className="w-full h-full object-contain" />
                        ) : (
                            <span className="text-xs text-center text-gray-500">City/Muni Logo</span>
                        )}
                    </div>
                </div>

                {/* Case Meta */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-sm font-bold">Case Number:</p>
                        <p className="text-xl font-mono border-b border-black">{caseData.case_number}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold">Date & Time Reported:</p>
                        <p className="text-lg border-b border-black">{formattedDate}</p>
                    </div>
                </div>

                {/* Main Content Table */}
                <div className="border-2 border-black">
                    {/* Row 1: Incident Type & Location */}
                    <div className="flex border-b border-black">
                        <div className="w-1/2 p-2 border-r border-black">
                            <p className="text-xs font-bold uppercase text-gray-600">Nature of Incident</p>
                            <p className="font-semibold">{caseData.incident_type}</p>
                        </div>
                        <div className="w-1/2 p-2">
                            <p className="text-xs font-bold uppercase text-gray-600">Place of Incident</p>
                            <p className="font-semibold">{caseData.incident_location}</p>
                        </div>
                    </div>

                    {/* Row 2: Title */}
                    <div className="p-2 border-b border-black">
                        <p className="text-xs font-bold uppercase text-gray-600">Subject / Title</p>
                        <p className="font-bold text-lg">{caseData.title}</p>
                    </div>

                    {/* Row 3: Parties */}
                    <div className="flex border-b border-black">
                        <div className="w-1/2 p-2 border-r border-black">
                            <p className="text-xs font-bold uppercase text-gray-600 mb-1">Complainant(s)</p>
                            <ul className="list-disc list-inside text-sm">
                                {involvedParties.filter(p => p.type === 'Complainant').map(p => (
                                    <li key={p.id}><span className="font-semibold">{p.name}</span> {p.contact_number && <span className="text-xs text-gray-500">({p.contact_number})</span>}</li>
                                ))}
                                {involvedParties.filter(p => p.type === 'Complainant').length === 0 && <li className="italic text-gray-500">None listed</li>}
                            </ul>
                        </div>
                        <div className="w-1/2 p-2">
                            <p className="text-xs font-bold uppercase text-gray-600 mb-1">Respondent(s)</p>
                            <ul className="list-disc list-inside text-sm">
                                {involvedParties.filter(p => p.type === 'Respondent').map(p => (
                                    <li key={p.id}><span className="font-semibold">{p.name}</span></li>
                                ))}
                                {involvedParties.filter(p => p.type === 'Respondent').length === 0 && <li className="italic text-gray-500">None listed</li>}
                            </ul>
                        </div>
                    </div>

                    {/* Row 4: Narrative */}
                    <div className="p-4 border-b border-black min-h-[150px]">
                        <p className="text-xs font-bold uppercase text-gray-600 mb-2">Narrative of Facts</p>
                        <p className="text-justify whitespace-pre-wrap leading-snug text-sm">
                            {caseData.narrative_facts || caseData.description}
                        </p>
                    </div>

                    {/* Row 5: Action Taken */}
                    <div className="p-4 min-h-[100px]">
                        <p className="text-xs font-bold uppercase text-gray-600 mb-2">Action Taken / Disposition</p>
                        <p className="text-justify whitespace-pre-wrap leading-snug text-sm">
                            {caseData.narrative_action || 'No specific action recorded.'}
                        </p>
                    </div>
                </div>

                {/* Status Footer */}
                <div className="mt-4 mb-12">
                    <p className="text-sm">Current Status: <span className="font-bold uppercase">{caseData.status}</span></p>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-12 mt-12">
                    <div className="text-center">
                        <div className="border-b border-black mb-2"></div>
                        <p className="text-xs font-bold uppercase">Signature of Complainant</p>
                    </div>
                    <div className="text-center">
                        <div className="border-b border-black mb-2"></div>
                        <p className="text-xs font-bold uppercase">Certified Correct By:</p>
                        <p className="text-sm font-semibold mt-4">{settings?.barangay_secretary || '[Name of Desk Officer]'}</p>
                        <p className="text-xs">Barangay Secretary / Desk Officer</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center text-[10px] text-gray-500 border-t border-gray-300 pt-2">
                    <p>This document is a system-generated extract from the Barangay Blotter System.</p>
                    <p>Generated on: {generatedDate} | Case ID: {caseData.id}</p>
                    <p>Not valid without the official Barangay Seal.</p>
                </div>
            </div>

            {/* Screen Content (Hidden on print) */}
            <div className="print:hidden">

                {/* Resolution Banner (For Closed/Resolved Cases) */}
                <ResolutionBanner
                    status={caseData.status}
                    resolutionDetails={caseData.resolution_details}
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
                                                <label htmlFor="contact" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact #</label>
                                                <input
                                                    type="text"
                                                    name="contact"
                                                    id="contact"
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
                                        showConfirm('Delete Evidence', 'Are you sure you want to delete this evidence? This action cannot be undone.', async () => {
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
                                            <DashboardEvidenceUploadForm caseId={caseData.id} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Guest Upload Links</h2>
                                    {!isReadOnly && (
                                        <form action={async (formData) => {
                                            const result = await generateCaseGuestLink(caseData.id, formData)
                                            if (result?.error) {
                                                showAlert('Error', result.error, 'error')
                                            } else if (result?.success) {
                                                showAlert('Link Generated', result.message, 'success')
                                            }
                                        }}>
                                            <SubmitButton className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800" loadingText="Generating...">
                                                Generate New Link
                                            </SubmitButton>
                                        </form>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {guestLinks.map(link => (
                                        <div key={link.id} className="mb-4">
                                            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg gap-2 border ${link.is_active ? 'bg-blue-50 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800' : 'bg-gray-100 border-gray-200 dark:bg-gray-700 dark:border-gray-600 opacity-75'}`}>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-mono text-blue-600 dark:text-blue-400">Link: ...{link.token.slice(-8)}</span>
                                                        <CopyButton text={`/guest/${link.token}`} label="Copy Link" />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">PIN: {link.pin}</span>
                                                        <CopyButton text={link.pin} label="Copy PIN" />
                                                    </div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Expires: <span suppressHydrationWarning>{new Date(link.expires_at).toLocaleString()}</span></span>
                                                    {!link.is_active && <span className="text-xs text-red-500 font-bold">INACTIVE</span>}
                                                </div>
                                                <div className="flex gap-3 items-center">
                                                    {link.is_active && (
                                                        <a href={`/guest/${link.token}`} target="_blank" className="text-sm text-blue-600 hover:underline dark:text-blue-400">Open</a>
                                                    )}
                                                    <form action={async () => {
                                                        if (isReadOnly) return;
                                                        const result = await toggleGuestLinkStatus(link.id, link.is_active, caseData.id)
                                                        if (result?.error) showAlert('Error', result.error, 'error')
                                                    }}>
                                                        <SubmitButton
                                                            className={`text-xs hover:underline ${link.is_active ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'} ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            loadingText="..."
                                                            disabled={isReadOnly}
                                                        >
                                                            {link.is_active ? 'Close Link' : 'Re-open Link'}
                                                        </SubmitButton>
                                                    </form>
                                                </div>
                                            </div>
                                            {link.is_active && (
                                                <form action={emailGuestLink} className="mt-2 flex gap-2 items-center pl-2">
                                                    <input type="hidden" name="link" value={`${origin}/guest/${link.token}`} />
                                                    <input type="hidden" name="pin" value={link.pin} />
                                                    <input type="hidden" name="caseId" value={caseData.id} />
                                                    <input type="email" name="email" placeholder="Recipient Email" required className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                    <SubmitButton className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800" loadingText="Sending...">
                                                        Email
                                                    </SubmitButton>
                                                </form>
                                            )}
                                        </div>
                                    ))}
                                    {guestLinks.length === 0 && <p className="text-sm text-gray-500 italic dark:text-gray-400">No links generated yet.</p>}
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
                                                            showConfirm('Delete Note', 'Are you sure you want to delete this note?', async () => {
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
