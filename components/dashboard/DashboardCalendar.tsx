'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, MapPin, FileText } from 'lucide-react'
import { getMonthlyHearings } from '@/app/dashboard/actions'
import Link from 'next/link'

type Hearing = {
    id: string
    hearing_date: string
    hearing_type: string
    location: string
    notes: string
    cases: {
        id: string
        case_number: string
        title: string
        status: string
    }
}

export default function DashboardCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [hearings, setHearings] = useState<Hearing[]>([])
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Fetch hearings when month changes
    useEffect(() => {
        const fetchHearings = async () => {
            setLoading(true)
            try {
                const data = await getMonthlyHearings(currentDate.getFullYear(), currentDate.getMonth())
                setHearings(data)
            } catch (error) {
                console.error('Failed to fetch hearings:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchHearings()
    }, [currentDate])

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const goToToday = () => {
        setCurrentDate(new Date())
    }

    const handleDateClick = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        setSelectedDate(date)
        setIsModalOpen(true)
    }

    const getHearingsForDay = (day: number) => {
        return hearings.filter(h => {
            const d = new Date(h.hearing_date)
            return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()
        })
    }

    const selectedHearings = selectedDate ? getHearingsForDay(selectedDate.getDate()) : []

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="font-bold text-gray-900 dark:text-white">Calendar</h3>
                    </div>
                    <button
                        onClick={goToToday}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                        Today
                    </button>
                </div>

                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/30 rounded-lg p-1">
                    <button onClick={prevMonth} className="p-1.5 hover:bg-white rounded-md shadow-sm dark:hover:bg-gray-600 transition-all text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button onClick={nextMonth} className="p-1.5 hover:bg-white rounded-md shadow-sm dark:hover:bg-gray-600 transition-all text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4 flex-grow">
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="text-center text-[10px] uppercase font-bold text-gray-400 py-1 tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1
                        const dayHearings = getHearingsForDay(day)
                        const hasHearings = dayHearings.length > 0
                        const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
                        const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth() && selectedDate?.getFullYear() === currentDate.getFullYear()

                        return (
                            <button
                                key={day}
                                onClick={() => handleDateClick(day)}
                                className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all group
                                    ${isToday
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none'
                                        : isSelected
                                            ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                                    }
                                    ${hasHearings && !isToday ? 'font-bold text-gray-900 dark:text-white' : ''}
                                `}
                            >
                                <span className="text-xs">{day}</span>
                                {hasHearings && (
                                    <div className="mt-1 flex gap-0.5">
                                        {dayHearings.slice(0, 3).map((h, idx) => {
                                            let colorClass = 'bg-gray-400'
                                            const status = h.cases.status

                                            if (['Settled', 'Closed', 'Dismissed'].includes(status)) {
                                                colorClass = 'bg-green-500'
                                            } else if (status === 'New') {
                                                colorClass = 'bg-blue-500'
                                            } else if (status === 'Under Investigation') {
                                                colorClass = 'bg-yellow-500'
                                            }

                                            return (
                                                <div
                                                    key={idx}
                                                    className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : colorClass}`}
                                                />
                                            )
                                        })}
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedDate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-blue-600" />
                                {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h4>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            {selectedHearings.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedHearings.map(h => (
                                        <div key={h.id} className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                    {new Date(h.hearing_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <Link href={`/dashboard/cases/${h.cases.id}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                    View Case <ChevronRight className="w-3 h-3" />
                                                </Link>
                                            </div>
                                            <h5 className="font-semibold text-gray-900 dark:text-white mb-1">{h.hearing_type}</h5>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-1">{h.cases.title}</p>

                                            <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                {h.location && (
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{h.location}</span>
                                                    </div>
                                                )}
                                                {h.notes && (
                                                    <div className="flex items-start gap-1.5">
                                                        <FileText className="w-3 h-3 mt-0.5" />
                                                        <span className="line-clamp-2">{h.notes}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <p>No hearings scheduled for this day.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
