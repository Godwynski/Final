'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Calendar, Clock, ChevronRight, Activity, Gavel } from 'lucide-react'

type ActionItemProps = {
    staleCases: any[]
    upcomingHearings: any[]
}

type TabType = 'overview' | 'hearings' | 'stale'

export default function ActionRequired({ staleCases, upcomingHearings }: ActionItemProps) {
    const [activeTab, setActiveTab] = useState<TabType>('overview')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (staleCases.length === 0 && upcomingHearings.length === 0) return null

    const totalAlerts = staleCases.length + upcomingHearings.length

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-bold text-gray-900 dark:text-white">Action Hub</h3>
                </div>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-red-900/30 dark:text-red-400">
                    {totalAlerts} Pending
                </span>
            </div>

            <div className="p-2">
                <div className="flex p-1 gap-1 bg-gray-100/50 dark:bg-gray-700/50 rounded-lg mb-4">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'overview'
                            ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('hearings')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'hearings'
                            ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        Hearings
                    </button>
                    <button
                        onClick={() => setActiveTab('stale')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'stale'
                            ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        Stale
                    </button>
                </div>

                <div className="space-y-3 min-h-[200px]">
                    {activeTab === 'overview' && (
                        <div className="space-y-3">
                            {upcomingHearings.length > 0 && (
                                <div className="p-3 rounded-lg bg-purple-50 border border-purple-100 dark:bg-purple-900/10 dark:border-purple-800/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-semibold text-sm">
                                            <Calendar className="w-4 h-4" />
                                            <span>Next Hearing</span>
                                        </div>
                                        <span className="text-[10px] font-bold bg-white text-purple-700 px-1.5 py-0.5 rounded border border-purple-100 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700">
                                            URGENT
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">
                                        {mounted ? new Date(upcomingHearings[0].hearing_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                        {mounted ? new Date(upcomingHearings[0].hearing_date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : ''}
                                    </p>
                                    <button
                                        onClick={() => setActiveTab('hearings')}
                                        className="text-xs text-purple-700 dark:text-purple-400 font-medium hover:underline flex items-center gap-1"
                                    >
                                        View details <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            )}

                            {staleCases.length > 0 && (
                                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 dark:bg-amber-900/10 dark:border-amber-800/50">
                                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-semibold text-sm mb-2">
                                        <Clock className="w-4 h-4" />
                                        <span>Attention Needed</span>
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{staleCases.length}</span>
                                        <span className="text-xs text-gray-600 dark:text-gray-300">stale cases</span>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('stale')}
                                        className="text-xs text-amber-700 dark:text-amber-400 font-medium hover:underline flex items-center gap-1"
                                    >
                                        Review list <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            )}

                            {upcomingHearings.length === 0 && staleCases.length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    All caught up!
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'hearings' && (
                        <div className="space-y-2">
                            {upcomingHearings.map((h) => (
                                <Link
                                    key={h.id}
                                    href={`/dashboard/cases/${h.case_id}`}
                                    className="block p-3 bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center dark:bg-purple-900/30 dark:text-purple-400 shrink-0">
                                            <Gavel className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                                                {h.hearing_type}
                                            </h5>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {new Date(h.hearing_date).toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-purple-600 dark:text-purple-400 mt-1 font-medium">
                                                Case #{h.cases?.case_number}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {upcomingHearings.length === 0 && <p className="text-center text-xs text-gray-500 py-4">No upcoming hearings</p>}
                        </div>
                    )}

                    {activeTab === 'stale' && (
                        <div className="space-y-2">
                            {staleCases.map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/dashboard/cases/${c.id}`}
                                    className="block p-3 bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center dark:bg-amber-900/30 dark:text-amber-400 shrink-0">
                                            <AlertTriangle className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {c.title}
                                            </h5>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Last updated: {new Date(c.updated_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="hidden sm:inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                            {c.status}
                                        </span>
                                        <Link
                                            href={`/dashboard/cases/${c.id}`}
                                            className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900/50 transition-colors"
                                        >
                                            Review Case #{c.case_number}
                                        </Link>
                                    </div>
                                </Link>
                            ))}
                            {staleCases.length === 0 && <p className="text-center text-xs text-gray-500 py-4">No stale cases</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
