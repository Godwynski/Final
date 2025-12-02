'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type FilterProps = {
    label: string
    paramName: string
    options: string[]
}

export default function FilterDropdown({ label, paramName, options }: FilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentValue = searchParams.get(paramName) || ''
    const [isOpen, setIsOpen] = useState(false)

    function handleSelect(value: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(paramName, value)
        } else {
            params.delete(paramName)
        }
        router.push(`?${params.toString()}`)
        setIsOpen(false)
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${currentValue
                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                        : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
                    }`}
            >
                {currentValue || label}
                <svg className="w-4 h-4 ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 z-20 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-y-auto">
                        <button
                            onClick={() => handleSelect('')}
                            className={`block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${!currentValue ? 'font-bold' : ''}`}
                        >
                            All {label}s
                        </button>
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleSelect(option)}
                                className={`block w-full text-left px-4 py-2 text-sm ${currentValue === option
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
