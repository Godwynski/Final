'use client'

import { useState, useEffect } from 'react'
import { uploadGuestEvidence } from './actions'
import UploadLimitInfo from '@/components/UploadLimitInfo'
import { CONFIG } from '@/constants/config'
import { Loader2 } from 'lucide-react'

export default function GuestUploadForm({ token, currentPhotoCount }: { token: string, currentPhotoCount: number }) {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isDocument, setIsDocument] = useState(false)

    const isAtLimit = currentPhotoCount >= CONFIG.GUEST_LINK.MAX_UPLOADS_PER_LINK

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
        }
    }, [previewUrl])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Check if it's an allowed file type
            const isImage = file.type.startsWith('image/')
            const isDoc = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
            
            if (!isImage && !isDoc) {
                setError('Please select an image or document file (PDF, DOC, DOCX).')
                return
            }
            
            setSelectedFile(file)
            setIsDocument(isDoc)
            
            if (previewUrl) URL.revokeObjectURL(previewUrl)
            
            if (isImage) {
                const url = URL.createObjectURL(file)
                setPreviewUrl(url)
            } else {
                setPreviewUrl(null) // No preview for documents
            }
            
            setError('')
            setMessage('')
        } else {
            setPreviewUrl(null)
            setSelectedFile(null)
            setIsDocument(false)
        }
    }

    // Compress image before upload
    const compressImage = async (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                const img = new Image()
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')!
                    
                    // Max dimensions
                    const MAX_WIDTH = 1920
                    const MAX_HEIGHT = 1920
                    
                    let width = img.width
                    let height = img.height
                    
                    // Calculate new dimensions
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = (height * MAX_WIDTH) / width
                            width = MAX_WIDTH
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = (width * MAX_HEIGHT) / height
                            height = MAX_HEIGHT
                        }
                    }
                    
                    canvas.width = width
                    canvas.height = height
                    
                    // Draw and compress
                    ctx.drawImage(img, 0, 0, width, height)
                    
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const compressedFile = new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: Date.now(),
                                })
                                resolve(compressedFile)
                            } else {
                                resolve(file) // Fallback to original
                            }
                        },
                        'image/jpeg',
                        0.8 // 80% quality
                    )
                }
                img.src = e.target?.result as string
            }
            reader.readAsDataURL(file)
        })
    }

    async function handleSubmit(formData: FormData) {
        if (!selectedFile) {
            setError('Please select a file first.')
            return
        }

        setIsLoading(true)
        setMessage(isDocument ? 'Uploading document...' : 'Compressing and uploading...')
        setError('')

        try {
            // Only compress images, not documents
            const file = formData.get('file') as File
            if (file && file.type.startsWith('image/')) {
                const compressedFile = await compressImage(file)
                formData.set('file', compressedFile)
                setMessage(`Uploading (${(compressedFile.size / 1024 / 1024).toFixed(1)}MB)...`)
            }

            // Add visibility flag to form data
            formData.set('is_visible', isVisible.toString())

            const res = await uploadGuestEvidence(token, formData)

            if (res?.error) {
                setError(res.error)
                setMessage('')
            } else if (res?.success) {
                setMessage('Evidence uploaded successfully!')
                // Reset form
                const form = document.getElementById('upload-form') as HTMLFormElement
                form.reset()
                setPreviewUrl(null)
                setSelectedFile(null)
                setIsDocument(false)
                setIsVisible(false) 
            }
        } catch {
            setError('An unexpected error occurred.')
            setMessage('')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Upload Limits Info */}
            <UploadLimitInfo
                currentCount={currentPhotoCount}
                maxCount={CONFIG.GUEST_LINK.MAX_UPLOADS_PER_LINK}
                maxSizeMB={CONFIG.FILE_UPLOAD.GUEST_MAX_SIZE_MB}
                userType="guest"
            />

            <form id="upload-form" action={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">
                        1. Select Evidence (Image or Document)
                    </label>
                    <input
                        name="file"
                        accept="image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="file_input"
                        type="file"
                        required
                        disabled={isAtLimit || isLoading}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                        Images (PNG, JPG, WebP) or Documents (PDF, DOC, DOCX) - Max {CONFIG.FILE_UPLOAD.GUEST_MAX_SIZE_MB}MB
                    </p>
                </div>

                {/* File Preview Section */}
                {previewUrl && !isDocument && (
                    <div className="p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <p className="text-sm font-semibold mb-2 text-blue-800 dark:text-blue-300">
                            Ready to Upload
                        </p>
                        <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={previewUrl} 
                                alt="Evidence Preview" 
                                className="w-full h-full object-contain" 
                            />
                        </div>
                    </div>
                )}
                
                {/* Document Preview */}
                {selectedFile && isDocument && (
                    <div className="p-4 border-2 border-dashed border-green-300 rounded-lg bg-green-50 dark:bg-green-900/20 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <p className="text-sm font-semibold mb-2 text-green-800 dark:text-green-300">
                            Document Ready to Upload
                        </p>
                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                                <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-900 dark:text-white">
                        2. Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows={2}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Describe this evidence..."
                        disabled={isAtLimit || isLoading}
                    ></textarea>
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center h-5">
                        <input
                            id="visibility"
                            type="checkbox"
                            checked={isVisible}
                            onChange={(e) => setIsVisible(e.target.checked)}
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
                            disabled={isAtLimit || isLoading}
                        />
                    </div>
                    <label htmlFor="visibility" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-gray-900 dark:text-white">Visible to to other parties?</span>
                        <p className="text-xs mt-0.5">Check this box if you want other involved parties to see this evidence.</p>
                    </label>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800">
                        {error}
                    </div>
                )}
                
                {message && (
                    <div className="p-3 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800">
                        {message}
                    </div>
                )}

                {/* Progress Indicator */}
                {isLoading && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                        <div className="bg-blue-600 h-2.5 rounded-full animate-progress-indeterminate w-full origin-left"></div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || isAtLimit || !selectedFile}
                    className="w-full relative flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Uploading Evidence... Please wait
                        </>
                    ) : isAtLimit ? (
                        'Upload Limit Reached'
                    ) : (
                        'Secure Upload'
                    )}
                </button>
            </form>
        </div>
    )
}
