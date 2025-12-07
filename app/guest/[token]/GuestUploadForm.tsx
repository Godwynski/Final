'use client'

import { useState } from 'react'
import { uploadGuestEvidence } from './actions'
import UploadLimitInfo from '@/components/UploadLimitInfo'
import { CONFIG } from '@/constants/config'

export default function GuestUploadForm({ token, currentPhotoCount }: { token: string, currentPhotoCount: number }) {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [isVisible, setIsVisible] = useState(false)

    const isAtLimit = currentPhotoCount >= CONFIG.GUEST_LINK.MAX_UPLOADS_PER_LINK

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setMessage('')
        setError('')

        // Add visibility flag to form data
        formData.set('is_visible', isVisible.toString())

        const res = await uploadGuestEvidence(token, formData)

        if (res?.error) {
            setError(res.error)
        } else if (res?.success) {
            setMessage('Evidence uploaded successfully!')
            // Reset form
            const form = document.getElementById('upload-form') as HTMLFormElement
            form.reset()
            setIsVisible(true)
        }
        setIsLoading(false)
    }

    return (
        <div className="space-y-4">
            {/* Upload Limits Info */}
            <UploadLimitInfo
                currentCount={currentPhotoCount}
                maxCount={CONFIG.GUEST_LINK.MAX_UPLOADS_PER_LINK}
                maxSizeMB={CONFIG.FILE_UPLOAD.GUEST_MAX_SIZE_MB}
                userType="guest"
            />

            <form id="upload-form" action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload Evidence (Images)</label>
                    <input
                        name="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="file_input"
                        type="file"
                        required
                        disabled={isAtLimit}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">SVG, PNG, JPG or GIF (MAX. {CONFIG.FILE_UPLOAD.GUEST_MAX_SIZE_MB}MB)</p>
                </div>
                <div>
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        rows={2}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Describe this evidence..."
                        disabled={isAtLimit}
                    ></textarea>
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="visibility"
                            type="checkbox"
                            checked={isVisible}
                            onChange={(e) => setIsVisible(e.target.checked)}
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
                            disabled={isAtLimit}
                        />
                    </div>
                    <label htmlFor="visibility" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-gray-900 dark:text-white">Visible to other parties</span>
                        <p className="text-xs mt-0.5">If unchecked, only staff can see this evidence</p>
                    </label>
                </div>

                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}

                <button
                    type="submit"
                    disabled={isLoading || isAtLimit}
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAtLimit ? 'Upload Limit Reached' : isLoading ? 'Uploading...' : 'Secure Upload'}
                </button>
            </form>
        </div>
    )
}
