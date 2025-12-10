'use client'

import { useState } from 'react'
import Image from 'next/image'
import { deleteGuestEvidence } from './actions'
import ImageLightbox from '@/components/ImageLightbox'

export default function GuestEvidenceList({ evidence, token }: { evidence: any[], token: string }) {
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<{ src: string, alt: string } | null>(null)

    async function handleDelete(id: string) {
        // Confirmation is handled by UI state now
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
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                                    </div>
                                </div>
                            ) : (
                                <a
                                    href={item.file_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center h-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <svg className="w-12 h-12 text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase">
                                        {item.file_type.split('/')[1]?.replace('vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx') || 'Document'}
                                    </span>
                                    <span className="text-xs text-blue-600 dark:text-blue-400 mt-1">Click to open</span>
                                </a>
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
                                
                                {deletingId === item.id ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-red-600 font-medium">Sure?</span>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() => setDeletingId(null)}
                                            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                                        >
                                            No
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setDeletingId(item.id)}
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                    >
                                        Delete
                                    </button>
                                )}
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
