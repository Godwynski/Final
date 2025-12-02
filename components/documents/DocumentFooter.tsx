import React from 'react'

interface DocumentFooterProps {
    settings: any
    type?: 'captain' | 'secretary' | 'both'
}

export default function DocumentFooter({ settings, type = 'captain' }: DocumentFooterProps) {
    const captain = settings?.barangay_captain || '[Punong Barangay Name]'
    const secretary = settings?.barangay_secretary || '[Secretary Name]'

    return (
        <div className="mt-16">
            {type === 'secretary' && (
                <div className="text-right">
                    <div className="inline-block text-center">
                        <p className="font-bold uppercase border-t border-black pt-2 px-8">{secretary}</p>
                        <p className="text-sm">Barangay Secretary</p>
                    </div>
                </div>
            )}

            {type === 'captain' && (
                <div className="text-right">
                    <div className="inline-block text-center">
                        <p className="font-bold uppercase border-t border-black pt-2 px-8">{captain}</p>
                        <p className="text-sm">Punong Barangay / Lupon Chairman</p>
                    </div>
                </div>
            )}

            {type === 'both' && (
                <div className="flex justify-between items-end">
                    <div className="text-center">
                        <p className="text-sm mb-8">Prepared by:</p>
                        <div className="inline-block text-center">
                            <p className="font-bold uppercase border-t border-black pt-2 px-8">{secretary}</p>
                            <p className="text-sm">Barangay Secretary</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm mb-8">Attested by:</p>
                        <div className="inline-block text-center">
                            <p className="font-bold uppercase border-t border-black pt-2 px-8">{captain}</p>
                            <p className="text-sm">Punong Barangay / Lupon Chairman</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
