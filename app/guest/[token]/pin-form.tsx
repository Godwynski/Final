'use client'

import { useState } from 'react'
import Image from 'next/image'
import { verifyGuestPin } from './actions'
import TermsModal from '@/components/TermsModal'

export default function PinEntryForm({ token }: { token: string }) {
    const [pin, setPin] = useState('')
    const [agreed, setAgreed] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showTerms, setShowTerms] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (!agreed) {
            setError('You must agree to the Terms and Conditions.')
            setLoading(false)
            return
        }

        const res = await verifyGuestPin(token, pin)
        if (res.error) {
            setError(res.error)
            setLoading(false)
        } else {
            // Success - page will likely reload due to revalidatePath, or we can force it
            window.location.reload()
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="flex items-center mb-6">
                <Image
                    src="/logo.png"
                    alt="Blotter System Logo"
                    width={56}
                    height={56}
                    className="mr-3"
                />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Blotter System</span>
            </div>
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Secure Access Required</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="pin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Enter Access PIN
                        </label>
                        <input
                            type="text"
                            id="pin"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center text-2xl tracking-widest"
                            placeholder="000000"
                            maxLength={6}
                            required
                        />
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                            />
                        </div>
                        <label htmlFor="terms" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            I agree to the{' '}
                            <button
                                type="button"
                                onClick={() => setShowTerms(true)}
                                className="text-blue-600 hover:underline dark:text-blue-500 font-medium"
                            >
                                Terms and Conditions
                            </button>
                            {' '}regarding the handling of sensitive case evidence.
                        </label>
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Access Portal'}
                    </button>
                </form>
            </div>

            <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
        </div>
    )
}
