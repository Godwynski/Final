'use client'

import { useState } from 'react'
import { uploadEvidence } from '@/app/dashboard/cases/[id]/actions'
import UploadLimitInfo from '@/components/UploadLimitInfo'
import { CONFIG } from '@/constants/config'
import { Loader2 } from 'lucide-react'

export default function DashboardEvidenceUploadForm({ caseId, currentPhotoCount }: { caseId: string, currentPhotoCount: number }) {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const isAtLimit = currentPhotoCount >= CONFIG.FILE_UPLOAD.STAFF_MAX_PHOTOS_PER_CASE

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setError('')
            setMessage('')
        } else {
            setSelectedFile(null)
        }
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setMessage('')
        setError('')

        const res = await uploadEvidence(caseId, formData)

        if (res?.error) {
            setError(res.error)
        } else if (res?.success) {
            setMessage('Evidence uploaded successfully!')
            // Reset form
            const form = document.getElementById('dashboard-upload-form') as HTMLFormElement
            form?.reset()
            setSelectedFile(null)
        }
        setIsLoading(false)
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <div className="space-y-4">
            {/* Upload Limits Info */}
            <UploadLimitInfo
                currentCount={currentPhotoCount}
                maxCount={CONFIG.FILE_UPLOAD.STAFF_MAX_PHOTOS_PER_CASE}
                maxSizeMB={CONFIG.FILE_UPLOAD.MAX_SIZE_MB}
                userType="staff"
            />

            <form id="dashboard-upload-form" action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="dashboard_file_input">Upload Evidence (Images)</label>
                    <input
                        name="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="dashboard_file_input"
                        type="file"
                        required
                        disabled={isAtLimit || isLoading}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">SVG, PNG, JPG or GIF (MAX. {CONFIG.FILE_UPLOAD.MAX_SIZE_MB}MB)</p>
                    {selectedFile && (
                        <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                            Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="dashboard_description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <textarea
                        name="description"
                        id="dashboard_description"
                        rows={2}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Describe this evidence..."
                        disabled={isAtLimit || isLoading}
                    ></textarea>
                </div>

                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}

                {/* Progress Indicator */}
                {isLoading && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-blue-700 dark:text-blue-300">Uploading evidence...</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || isAtLimit || !selectedFile}
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isAtLimit ? 'Upload Limit Reached' : isLoading ? 'Uploading...' : 'Upload Evidence'}
                </button>
            </form>
        </div>
    )
}
