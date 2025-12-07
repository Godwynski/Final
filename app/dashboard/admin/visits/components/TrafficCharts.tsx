'use client'

import { VisitStats } from '../actions'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { Clock, PieChart as PieIcon, TrendingUp } from 'lucide-react'

export default function TrafficCharts({ stats }: { stats: VisitStats }) {
    // Colors for pie charts
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1']

    const maxHourCount = Math.max(...(stats.hourlyDistribution?.map(h => h.count) || [1]), 1)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hourly Traffic */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" /> Hourly Activity
                </h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.hourlyDistribution}>
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {stats.hourlyDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`rgba(59, 130, 246, ${0.4 + (entry.count / maxHourCount) * 0.6})`} />
                                ))}
                            </Bar>
                            <XAxis
                                dataKey="hour"
                                tickFormatter={(tick) => `${tick}:00`}
                                stroke="#9CA3AF"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                interval={3}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Pages */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gray-500" /> Top Pages
                </h3>
                <div className="space-y-4">
                    {stats.topPages.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-12">No page data yet</p>
                    ) : (
                        stats.topPages.map((p, i) => (
                            <div key={i} className="group relative">
                                <div className="absolute inset-y-0 left-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-all" style={{ width: `${(p.count / stats.topPages[0].count) * 100}%` }} />
                                <div className="relative flex items-center justify-between p-2 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate flex-1 mr-4" title={p.page}>
                                        {p.page}
                                    </span>
                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                        {p.count.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Device & Browser Row - Nested Grid inside one col or separate? The user sees 2 cols. */}
            {/* Let's actually make a 3rd wide visualization or split device/browser.
                The previous design had them side by side.
                Let's put them in a flex row below these if we were in the main file, but here we can just export a component that contains them.
             */}
        </div>
    )
}

export function DeviceBrowserCharts({ stats }: { stats: VisitStats }) {
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Device Distribution</h3>
                <div className="h-[200px] w-full flex-1 min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.deviceStats}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="count"
                            >
                                {stats.deviceStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
                    {stats.deviceStats.map((entry, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-gray-600 dark:text-gray-300">{entry.name} ({entry.count})</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Browser Distribution</h3>
                <div className="h-[200px] w-full flex-1 min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.browserStats}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="count"
                            >
                                {stats.browserStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
                    {stats.browserStats.slice(0, 5).map((entry, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-gray-600 dark:text-gray-300">{entry.name} ({entry.count})</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
