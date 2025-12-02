'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CASE_WORKFLOW, WorkflowAction, STATUS_DESCRIPTIONS } from '@/app/dashboard/cases/workflow'
import { performCaseAction } from '@/app/dashboard/cases/[id]/actions'
import SubmitButton from '@/components/SubmitButton'

export default function CaseActionHeader({ status, caseId }: { status: string, caseId: string }) {
    const router = useRouter()
    const actions = CASE_WORKFLOW[status] || []
    const [selectedAction, setSelectedAction] = useState<WorkflowAction | null>(null)
    const [inputVal, setInputVal] = useState('')
    const [loading, setLoading] = useState(false)

    const handleActionClick = async (action: WorkflowAction) => {
        if (action.requiresInput) {
            setSelectedAction(action)
            setInputVal('')
        } else {
            if (confirm(`Are you sure you want to ${action.label}?`)) {
                setLoading(true)
                const res = await performCaseAction(caseId, action.action)
                setLoading(false)
                if (res?.error) {
                    alert(res.error)
                } else {
                    if (res?.redirect) {
                        window.open(res.redirect, '_blank')
                    }
                    router.refresh()
                }
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedAction) return

        setLoading(true)
        const res = await performCaseAction(caseId, selectedAction.action, inputVal)
        setLoading(false)

        if (res?.error) {
            alert(res.error)
        } else {
            if (res?.redirect) {
                window.open(res.redirect, '_blank')
            }
            setSelectedAction(null)
            router.refresh()
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Available Actions</h2>
                <div className="flex flex-wrap gap-2 justify-end">
                    {actions.length > 0 ? (
                        actions.map((action) => (
                            <button
                                key={action.action}
                                onClick={() => handleActionClick(action)}
                                disabled={loading}
                                className={`px-4 py-2 rounded-lg text-sm font-medium focus:ring-4 focus:outline-none transition-colors
                                    ${action.variant === 'primary' ? 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' : ''}
                                    ${action.variant === 'secondary' ? 'text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700' : ''}
                                    ${action.variant === 'danger' ? 'text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900' : ''}
                                    ${action.variant === 'success' ? 'text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' : ''}
                                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                title={action.description || action.label}
                            >
                                {action.icon && <span className="mr-2">{/* Icon placeholder */}</span>}
                                {action.label}
                            </button>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic">No actions available for this status.</p>
                    )}
                </div>
            </div>

            {/* Modal for Input */}
            {selectedAction && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{selectedAction.label}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    {selectedAction.inputLabel}
                                </label>
                                {selectedAction.inputType === 'textarea' ? (
                                    <textarea
                                        required
                                        rows={4}
                                        value={inputVal}
                                        onChange={(e) => setInputVal(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    ></textarea>
                                ) : (
                                    <input
                                        type={selectedAction.inputType}
                                        required
                                        value={inputVal}
                                        onChange={(e) => setInputVal(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    />
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedAction(null)}
                                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    {loading ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
