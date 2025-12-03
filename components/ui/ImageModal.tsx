'use client'

interface ImageModalProps {
    isOpen: boolean
    onClose: () => void
    imageUrl: string
    altText?: string
}

export default function ImageModal({ isOpen, onClose, imageUrl, altText = 'Image Preview' }: ImageModalProps) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white hover:text-gray-300 focus:outline-none"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <img
                    src={imageUrl}
                    alt={altText}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    )
}
