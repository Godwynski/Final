'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Calendar, ChevronDown, ArrowRight } from 'lucide-react'

const presets = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'This Month', value: 'this_month' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'Specific Date', value: 'specific' },
    { label: 'Custom Range', value: 'custom' },
]

export default function DateRangePicker({ defaultValue = '30d' }: { defaultValue?: string }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentRange = searchParams.get('range') || defaultValue
    const startParam = searchParams.get('startDate') || ''
    const endParam = searchParams.get('endDate') || ''

    const [isOpen, setIsOpen] = useState(false)
    const [showCustomInputs, setShowCustomInputs] = useState(currentRange === 'custom')
    const [showSpecificInput, setShowSpecificInput] = useState(currentRange === 'specific')
    const [startDate, setStartDate] = useState(startParam)
    const [endDate, setEndDate] = useState(endParam)

    useEffect(() => {
        if (!isOpen) {
            setShowCustomInputs(currentRange === 'custom')
            setShowSpecificInput(currentRange === 'specific')
        }
    }, [isOpen, currentRange])

    function handleSelect(value: string) {
        if (value === 'custom') {
            setShowCustomInputs(true)
            setShowSpecificInput(false)
            return
        }
        if (value === 'specific') {
            setShowSpecificInput(true)
            setShowCustomInputs(false)
            return
        }

        const params = new URLSearchParams(searchParams.toString())
        params.set('range', value)
        params.delete('startDate')
        params.delete('endDate')

        // Reset page to 1 when filter changes
        params.set('page', '1')

        router.push(`?${params.toString()}`)
        setIsOpen(false)
        setShowCustomInputs(false)
        setShowSpecificInput(false)
    }

    function applyCustomRange() {
        if (!startDate || !endDate) return

        const params = new URLSearchParams(searchParams.toString())
        params.set('range', 'custom')
        params.set('startDate', startDate)
        params.set('endDate', endDate)
        params.set('page', '1')

        router.push(`?${params.toString()}`)
        setIsOpen(false)
    }

    function applySpecificDate() {
        if (!startDate) return

        const params = new URLSearchParams(searchParams.toString())
        params.set('range', 'specific')
        params.set('startDate', startDate)
        params.set('endDate', startDate)
        params.set('page', '1')

        router.push(`?${params.toString()}`)
        setIsOpen(false)
    }

    const getLabel = () => {
        if (currentRange === 'custom' && startParam && endParam) {
            return `${new Date(startParam).toLocaleDateString()} - ${new Date(endParam).toLocaleDateString()}`
        }
        if (currentRange === 'specific' && startParam) {
            return new Date(startParam).toLocaleDateString()
        }
        return presets.find(r => r.value === currentRange)?.label || 'All Time'
    }

    return (
        <div className="relative w-fit">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
            >
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span>{getLabel()}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 z-20 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        {!showCustomInputs && !showSpecificInput ? (
                            <div className="max-h-80 overflow-y-auto">
                                <div className="px-2 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Presets</div>
                                {presets.map((range) => (
                                    <button
                                        key={range.value}
                                        onClick={() => handleSelect(range.value)}
                                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${currentRange === range.value
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium'
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        ) : showSpecificInput ? (
                            <div className="p-4 space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Select Date</h3>
                                <div className="space-y-2">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white p-2.5"
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => setShowSpecificInput(false)}
                                        className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={applySpecificDate}
                                        className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Custom Range</h3>
                                <div className="space-y-2">
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">From</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white p-2.5"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">To</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white p-2.5"
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => setShowCustomInputs(false)}
                                        className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={applyCustomRange}
                                        className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
