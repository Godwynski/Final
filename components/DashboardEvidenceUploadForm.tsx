'use client'

import { useState } from 'react'
import { uploadEvidence } from '@/app/dashboard/cases/[id]/actions'

export default function DashboardEvidenceUploadForm({ caseId }: { caseId: string }) {
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        // We rely on the server action to redirect/revalidate, so we don't need manual error handling here 
        // unless we want to intercept it. The server action redirects on success/error.
        // However, for better UX, we might want to handle it here if we change the action to return data instead of redirect.
        // But the current action redirects. So we just set loading.
        await uploadEvidence(caseId, formData)
        setIsLoading(false)
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="dashboard_file_input">Upload Evidence (Images)</label>
                <input
                    name="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="dashboard_file_input"
                    type="file"
                    required
                />
            </div>
            <div>
                <label htmlFor="dashboard_description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <textarea
                    name="description"
                    id="dashboard_description"
                    rows={2}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Describe this evidence..."
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:opacity-50"
            >
                {isLoading ? 'Uploading...' : 'Upload Evidence'}
            </button>
        </form>
    )
}
