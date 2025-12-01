/**
 * Example component showing how to add loading states to forms
 * Uses React's useFormStatus hook to show loading indicators
 * 
 * Usage: Import this component in any form that uses server actions
 */

'use client'

import { useFormStatus } from 'react-dom'

/**
 * Submit button with loading state
 * Automatically disables and shows spinner when form is submitting
 */
export function SubmitButton({
    children = 'Submit',
    loadingText = 'Processing...',
    className = ''
}: {
    children?: React.ReactNode
    loadingText?: string
    className?: string
}) {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className={`inline-flex items-center justify-center ${className} ${pending ? 'opacity-70 cursor-not-allowed' : ''
                }`}
        >
            {pending && (
                <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {pending ? loadingText : children}
        </button>
    )
}

/**
 * Example: Login form with loading state
 */
export function ExampleLoginForm() {
    return (
        <form action="/api/login" method="POST">
            <div className="mb-4">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border rounded"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="w-full px-3 py-2 border rounded"
                />
            </div>

            <SubmitButton
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                loadingText="Signing in..."
            >
                Sign In
            </SubmitButton>
        </form>
    )
}

/**
 * Alternative: Inline loading indicator
 */
export function FormLoadingIndicator() {
    const { pending } = useFormStatus()

    if (!pending) return null

    return (
        <div className="flex items-center justify-center p-4">
            <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
            <span className="ml-3 text-gray-600">Processing...</span>
        </div>
    )
}

/**
 * Usage in existing forms:
 * 
 * 1. Import the SubmitButton:
 *    import { SubmitButton } from '@/components/ui/FormLoadingStates'
 * 
 * 2. Replace your submit button:
 *    <SubmitButton className="your-classes">
 *      Your Button Text
 *    </SubmitButton>
 * 
 * 3. The button will automatically show loading state when form is submitting
 */
