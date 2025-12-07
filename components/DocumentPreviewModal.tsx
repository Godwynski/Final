'use client'

import { useState, useRef } from 'react'
import SummonsForm from './documents/forms/SummonsForm'
import NoticeOfHearingForm from './documents/forms/NoticeOfHearingForm'
import CertificateToFileActionForm from './documents/forms/CertificateToFileActionForm'
import AmicableSettlementForm from './documents/forms/AmicableSettlementForm'
import ReferralForm from './documents/forms/ReferralForm'
import AbstractForm from './documents/forms/AbstractForm'

export type DocumentType = 'summons' | 'hearing' | 'cfa' | 'settlement' | 'referral' | 'abstract'

interface DocumentPreviewModalProps {
    isOpen: boolean
    onClose: () => void
    documentType: DocumentType
    caseData: any
    involvedParties: any[]
    settings: any
    evidence?: any[]
    hearings?: any[]
}

const documentTitles: Record<DocumentType, string> = {
    summons: 'Summons',
    hearing: 'Notice of Hearing',
    cfa: 'Certificate to File Action',
    settlement: 'Amicable Settlement',
    referral: 'Referral / Endorsement',
    abstract: 'Case Abstract'
}

export default function DocumentPreviewModal({
    isOpen,
    onClose,
    documentType,
    caseData,
    involvedParties,
    settings,
    evidence = [],
    hearings = []
}: DocumentPreviewModalProps) {
    const [isDownloading, setIsDownloading] = useState(false)
    const [includeEvidence, setIncludeEvidence] = useState(false)
    const printRef = useRef<HTMLDivElement>(null)

    if (!isOpen) return null

    const complainants = involvedParties.filter(p => p.type === 'Complainant')
    const respondents = involvedParties.filter(p => p.type === 'Respondent')

    const handlePrint = () => {
        if (!printRef.current) return

        const content = printRef.current.innerHTML

        // Create hidden iframe for printing (doesn't redirect the page)
        const iframe = document.createElement('iframe')
        iframe.style.position = 'absolute'
        iframe.style.width = '0'
        iframe.style.height = '0'
        iframe.style.border = 'none'
        iframe.style.left = '-9999px'
        document.body.appendChild(iframe)

        const iframeDoc = iframe.contentWindow?.document
        if (!iframeDoc) {
            document.body.removeChild(iframe)
            return
        }

        iframeDoc.open()
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${documentTitles[documentType]} - Case #${caseData.case_number}</title>
                <style>
                    @page { size: Letter; margin: 0.5in; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                    body { font-family: 'Times New Roman', serif; margin: 0; padding: 20px; color: #000; background: white; }
                    * { box-sizing: border-box; }
                    img { max-width: 100%; height: auto; }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .text-left { text-align: left; }
                    .text-justify { text-align: justify; }
                    .font-bold { font-weight: bold; }
                    .font-semibold { font-weight: 600; }
                    .font-serif { font-family: 'Times New Roman', serif; }
                    .font-mono { font-family: monospace; }
                    .font-sans { font-family: Arial, sans-serif; }
                    .font-black { font-weight: 900; }
                    .uppercase { text-transform: uppercase; }
                    .underline { text-decoration: underline; }
                    .italic { font-style: italic; }
                    .tracking-wide { letter-spacing: 0.025em; }
                    .indent-8 { text-indent: 2rem; }
                    .mt-1 { margin-top: 0.25rem; } .mt-2 { margin-top: 0.5rem; } .mt-3 { margin-top: 0.75rem; }
                    .mt-4 { margin-top: 1rem; } .mt-6 { margin-top: 1.5rem; } .mt-8 { margin-top: 2rem; }
                    .mt-12 { margin-top: 3rem; } .mt-16 { margin-top: 4rem; }
                    .mb-1 { margin-bottom: 0.25rem; } .mb-2 { margin-bottom: 0.5rem; }
                    .mb-4 { margin-bottom: 1rem; } .mb-6 { margin-bottom: 1.5rem; } .mb-8 { margin-bottom: 2rem; }
                    .mb-12 { margin-bottom: 3rem; } .mb-16 { margin-bottom: 4rem; }
                    .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
                    .pt-2 { padding-top: 0.5rem; } .pt-4 { padding-top: 1rem; }
                    .pb-4 { padding-bottom: 1rem; }
                    .px-4 { padding-left: 1rem; padding-right: 1rem; }
                    .px-8 { padding-left: 2rem; padding-right: 2rem; }
                    .px-28 { padding-left: 7rem; padding-right: 7rem; }
                    .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
                    .mx-1 { margin-left: 0.25rem; margin-right: 0.25rem; }
                    .mx-8 { margin-left: 2rem; margin-right: 2rem; }
                    .ml-8 { margin-left: 2rem; }
                    .p-2 { padding: 0.5rem; } .p-4 { padding: 1rem; } .p-8 { padding: 2rem; }
                    .space-y-1 > * + * { margin-top: 0.25rem; }
                    .space-y-2 > * + * { margin-top: 0.5rem; }
                    .space-y-4 > * + * { margin-top: 1rem; }
                    .space-y-6 > * + * { margin-top: 1.5rem; }
                    .flex { display: flex; }
                    .inline-block { display: inline-block; }
                    .block { display: block; }
                    .justify-between { justify-content: space-between; }
                    .justify-center { justify-content: center; }
                    .items-start { align-items: flex-start; }
                    .items-center { align-items: center; }
                    .items-end { align-items: flex-end; }
                    .flex-1 { flex: 1; }
                    .gap-2 { gap: 0.5rem; } .gap-4 { gap: 1rem; } .gap-12 { gap: 3rem; }
                    .border { border: 1px solid #9ca3af; }
                    .border-2 { border: 2px solid #000; }
                    .border-t { border-top: 1px solid #000; }
                    .border-b { border-bottom: 1px solid #000; }
                    .border-r { border-right: 1px solid #000; }
                    .border-t-2 { border-top: 2px solid #000; }
                    .border-b-2 { border-bottom: 2px solid #000; }
                    .border-black { border-color: #000; }
                    .border-gray-300 { border-color: #d1d5db; }
                    .border-gray-400 { border-color: #9ca3af; }
                    .border-dashed { border-style: dashed; }
                    .rounded-full { border-radius: 9999px; }
                    .w-full { width: 100%; }
                    .w-20 { width: 5rem; } .w-24 { width: 6rem; } .w-32 { width: 8rem; } .w-48 { width: 12rem; }
                    .w-1\\/2 { width: 50%; } .w-1\\/3 { width: 33.333%; } .w-2\\/3 { width: 66.666%; }
                    .h-20 { height: 5rem; } .h-24 { height: 6rem; } .h-32 { height: 8rem; }
                    .min-h-\\[100px\\] { min-height: 100px; }
                    .min-h-\\[150px\\] { min-height: 150px; }
                    .max-w-\\[210mm\\] { max-width: 210mm; }
                    .mx-auto { margin-left: auto; margin-right: auto; }
                    .min-h-screen { min-height: auto; }
                    .bg-white { background: white; }
                    .bg-gray-50 { background: #f9fafb; }
                    .text-black { color: black; }
                    .text-gray-400 { color: #9ca3af; }
                    .text-gray-500 { color: #6b7280; }
                    .text-gray-600 { color: #4b5563; }
                    .grid { display: grid; }
                    .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
                    .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
                    .list-disc { list-style-type: disc; }
                    .list-inside { list-style-position: inside; }
                    .text-\\[10px\\] { font-size: 10px; }
                    .text-xs { font-size: 0.75rem; } .text-sm { font-size: 0.875rem; }
                    .text-base { font-size: 1rem; } .text-lg { font-size: 1.125rem; }
                    .text-xl { font-size: 1.25rem; } .text-2xl { font-size: 1.5rem; }
                    .leading-snug { line-height: 1.375; }
                    .leading-tight { line-height: 1.25; }
                    .leading-relaxed { line-height: 1.625; }
                    .whitespace-pre-wrap { white-space: pre-wrap; }
                    .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                    .object-contain { object-fit: contain; }
                    .object-cover { object-fit: cover; }
                    .rounded-lg { border-radius: 0.5rem; }
                    .relative { position: relative; }
                    .absolute { position: absolute; }
                    .top-0 { top: 0; } .left-0 { left: 0; } .right-0 { right: 0; }
                    .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
                </style>
            </head>
            <body>${content}</body>
            </html>
        `)
        iframeDoc.close()

        // Wait for images to load then print
        iframe.onload = () => {
            setTimeout(() => {
                iframe.contentWindow?.focus()
                iframe.contentWindow?.print()
                // Remove iframe after a delay to ensure print dialog closed
                setTimeout(() => {
                    document.body.removeChild(iframe)
                }, 1000)
            }, 100)
        }
    }

    const handleDownloadPDF = async () => {
        setIsDownloading(true)
        try {
            const params = new URLSearchParams({
                caseId: caseData.id,
                formType: documentType,
                ...(includeEvidence && { includeEvidence: 'true' })
            })
            const response = await fetch(`/api/documents/download?${params.toString()}`)
            if (!response.ok) throw new Error('Failed to generate PDF')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${documentTitles[documentType].replace(/\s+/g, '_')}_${caseData.case_number || caseData.id}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Download error:', error)
            alert('Failed to download PDF. Please try again.')
        } finally {
            setIsDownloading(false)
        }
    }

    const renderDocument = () => {
        const props = {
            caseData,
            complainants,
            respondents,
            settings,
            hearings
        }

        switch (documentType) {
            case 'summons':
                return <SummonsForm {...props} />
            case 'hearing':
                return <NoticeOfHearingForm {...props} />
            case 'cfa':
                return <CertificateToFileActionForm {...props} />
            case 'settlement':
                return <AmicableSettlementForm {...props} />
            case 'referral':
                return <ReferralForm {...props} />
            case 'abstract':
                return <AbstractForm caseData={caseData} involvedParties={involvedParties} settings={settings} evidence={includeEvidence ? evidence : []} />
            default:
                return null
        }
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative h-full flex flex-col">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {documentTitles[documentType]}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Case #{caseData.case_number}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Evidence Toggle - Only show for Abstract */}
                        {documentType === 'abstract' && evidence.length > 0 && (
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeEvidence}
                                    onChange={(e) => setIncludeEvidence(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Include evidence ({evidence.length} photos)
                                </span>
                            </label>
                        )}
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            {isDownloading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Document Preview Area */}
                <div className="flex-1 overflow-auto bg-gray-200 dark:bg-gray-900 p-4 sm:p-8">
                    <div
                        ref={printRef}
                        className="bg-white shadow-xl mx-auto"
                        style={{ maxWidth: '8.5in' }}
                    >
                        {renderDocument()}
                    </div>
                </div>
            </div>
        </div>
    )
}
