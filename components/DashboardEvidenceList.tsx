'use client'

import { useState } from 'react'
import { deleteEvidence } from '@/app/dashboard/cases/[id]/actions'
import ImageLightbox from '@/components/ImageLightbox'

export default function DashboardEvidenceList({ evidence, caseId }: { evidence: any[], caseId: string }) {
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<{ src: string, alt: string } | null>(null)

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this evidence? This action cannot be undone.')) return

        setDeletingId(id)
        const res = await deleteEvidence(caseId, id)
        setDeletingId(null)

        if (res?.error) {
            alert(res.error)
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
                    <div key={e.id} className="relative group border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800">
                        {e.file_type.startsWith('image/') ? (
                            <div
                                className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border dark:border-gray-700 cursor-pointer"
                                onClick={() => setSelectedImage({ src: e.file_path, alt: e.file_name })}
                            >
                                <img src={e.file_path} alt={e.file_name} className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                                    <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center aspect-video bg-gray-100 rounded-lg border dark:bg-gray-700 dark:border-gray-600">
                                <span className="text-gray-500 text-xs">{e.file_name}</span>
                            </div>
                        )}
                        <div className="mt-2">
                            <p className="text-xs font-medium text-gray-900 dark:text-white truncate" title={e.file_name}>{e.file_name}</p>
                            {e.description && <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={e.description}>{e.description}</p>}
                        </div>

                        <button
                            onClick={() => handleDelete(e.id)}
                            disabled={deletingId === e.id}
                            className="mt-2 w-full text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-900 rounded py-1 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                        >
                            {deletingId === e.id ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <ImageLightbox
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </>
    )
}
