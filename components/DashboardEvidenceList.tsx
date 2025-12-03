'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function DashboardEvidenceList({
    evidence,
    caseId,
    onViewImage,
    onDelete
}: {
    evidence: any[],
    caseId: string,
    onViewImage: (url: string) => void,
    onDelete?: (id: string) => void
}) {
    const [deletingId, setDeletingId] = useState<string | null>(null)

    async function handleDeleteClick(id: string) {
        if (onDelete) {
            setDeletingId(id)
            await onDelete(id)
            setDeletingId(null)
        }
    }

    if (!evidence || evidence.length === 0) {
        return (
            <p className="text-gray-500 italic mb-4">No evidence uploaded.</p>
        )
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {evidence.map(e => (
                    <div key={e.id} className="relative group border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                        {e.file_type.startsWith('image/') ? (
                            <div
                                className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border dark:border-gray-700 cursor-pointer group-hover:opacity-90 transition-opacity"
                                onClick={() => onViewImage(e.file_path)}
                            >
                                <Image
                                    src={e.file_path}
                                    alt={e.file_name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                                    <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                                </div>
                            </div>
                        ) : (
                            <a
                                href={e.file_path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center justify-center aspect-video bg-gray-50 hover:bg-gray-100 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors group-hover:border-blue-300 dark:group-hover:border-blue-500"
                            >
                                <svg className="w-8 h-8 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                </svg>
                                <span className="text-xs text-gray-500 font-medium uppercase">{e.file_type.split('/')[1] || 'FILE'}</span>
                            </a>
                        )}
                        <div className="mt-3">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1" title={e.file_name}>{e.file_name}</p>
                                {!e.file_type.startsWith('image/') && (
                                    <a href={e.file_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="Download/Open">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                    </a>
                                )}
                            </div>
                            {e.description && <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1" title={e.description}>{e.description}</p>}
                        </div>

                        {onDelete && (
                            <button
                                onClick={() => handleDeleteClick(e.id)}
                                disabled={deletingId === e.id}
                                className="mt-3 w-full text-xs font-medium text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white border border-red-200 dark:border-red-900 rounded py-1.5 hover:bg-red-600 dark:hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deletingId === e.id ? 'Deleting...' : 'Delete Evidence'}
                            </button>
                        )}
                    </div>
                ))}
            </div>


        </>
    )
}
