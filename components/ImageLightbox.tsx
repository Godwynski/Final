'use client'

import { useEffect } from 'react'

interface ImageLightboxProps {
    src: string
    alt: string
    onClose: () => void
}

export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
    // Handle Esc key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div className="relative max-w-7xl max-h-screen w-full h-full flex items-center justify-center">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none z-10 bg-black/50 rounded-full p-2"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <img
                    src={src}
                    alt={alt}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
                />
            </div>
        </div>
    )
}
