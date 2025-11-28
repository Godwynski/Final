'use client'

import { deleteCase } from '../actions'

export default function DeleteCaseButton({ caseId }: { caseId: string }) {
    return (
        <form action={deleteCase.bind(null, caseId)}>
            <button
                type="submit"
                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                onClick={(e) => {
                    if (!confirm('Are you sure you want to delete this case? This action cannot be undone.')) {
                        e.preventDefault()
                    }
                }}
            >
                Delete Case
            </button>
        </form>
    )
}
