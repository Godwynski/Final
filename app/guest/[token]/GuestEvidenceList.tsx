'use client'

import { useState } from 'react'
import { deleteGuestEvidence } from './actions'

export default function GuestEvidenceList({ evidence, token }: { evidence: any[], token: string }) {
    const [deletingId, setDeletingId] = useState<string | null>(null)

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {evidence.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col">
                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                        {item.file_type.startsWith('image/') ? (
                            <img src={item.file_path} alt={item.file_name} className="object-cover w-full h-full" />
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
                            <span className="text-xs text-gray-500 dark:text-gray-400">
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
    )
}
