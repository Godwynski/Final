'use client'

import { VisitStats } from '../actions'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Eye, Activity, UserCheck, BarChart3 } from 'lucide-react'

export default function StatsOverview({ stats }: { stats: VisitStats }) {
    const cards = [
        {
            title: 'Total Page Views',
            value: stats.totalPageViews,
            sub: `+${stats.todayPageViews} today`,
            icon: Eye,
            color: 'blue'
        },
        {
            title: 'Total Sessions',
            value: stats.totalSessions,
            sub: `+${stats.todaySessions} today`,
            icon: Activity,
            color: 'green'
        },
        {
            title: 'Unique Visitors',
            value: stats.uniqueDailyVisitors,
            sub: `+${stats.todayUniqueVisitors} today`,
            icon: UserCheck,
            color: 'purple'
        },
        {
            title: 'Avg Daily Views',
            value: stats.avgDailyPageViews,
            sub: 'per day average',
            icon: BarChart3,
            color: 'orange'
        }
    ]

    const colorClasses = {
        blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    }

    return (
        <div className="space-y-6">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-lg ${colorClasses[card.color as keyof typeof colorClasses]}`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value.toLocaleString()}</p>
                                <p className={`text-xs ${colorClasses[card.color as keyof typeof colorClasses].split(' ').slice(2).join(' ')}`}>
                                    {card.sub}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Traffic Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Traffic Over Time</h3>
                <div className="h-[300px] w-full">
                    {stats.dailyStats.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.dailyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(str) => {
                                        const date = new Date(str);
                                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                    }}
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => value.toLocaleString()}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    labelStyle={{ color: '#6B7280' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pageViews"
                                    name="Page Views"
                                    stroke="#3b82f6"
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sessions"
                                    name="Sessions"
                                    stroke="#10b981"
                                    fillOpacity={1}
                                    fill="url(#colorSessions)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                            No data available for the selected period
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
