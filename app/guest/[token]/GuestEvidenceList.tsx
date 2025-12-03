'use client'

import { useState } from 'react'
import Image from 'next/image'
import { deleteGuestEvidence } from './actions'
import ImageLightbox from '@/components/ImageLightbox'

export default function GuestEvidenceList({ evidence, token }: { evidence: any[], token: string }) {
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<{ src: string, alt: string } | null>(null)

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this evidence? This action cannot be undone.')) return

        setDeletingId(id)
        const res = await deleteGuestEvidence(token, id)
        setDeletingId(null)

        if (res?.error) {
            alert(res.error)
        }
    }

    if (!evidence || evidence.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">No evidence uploaded yet.</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {evidence.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col">
                        <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden group">
                            {item.file_type.startsWith('image/') ? (
                                <div
                                    className="cursor-pointer w-full h-full relative"
                                    onClick={() => setSelectedImage({ src: item.file_path, alt: item.file_name })}
                                >
                                    <Image
                                        src={item.file_path}
                                        alt={item.file_name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-gray-500 dark:text-gray-400">{item.file_name}</span>
                                </div>
                            )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white truncate" title={item.file_name}>
                                {item.file_name}
                            </h5>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex-1">
                                {item.description || <span className="italic text-gray-500">No description provided.</span>}
                            </p>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <span className="text-xs text-gray-500 dark:text-gray-400" suppressHydrationWarning>
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    disabled={deletingId === item.id}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 disabled:opacity-50"
                                >
                                    {deletingId === item.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
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
