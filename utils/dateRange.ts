export function getDateRangeFromParams(range: string = '30d', customStart?: string, customEnd?: string) {
    const now = new Date()
    let startDate = new Date()
    let endDate: Date | null = null

    // Helper to get start of day
    const startOfDay = (d: Date) => {
        d.setHours(0, 0, 0, 0)
        return d
    }

    // Helper to get end of day
    const endOfDay = (d: Date) => {
        d.setHours(23, 59, 59, 999)
        return d
    }

    switch (range) {
        case 'today':
            startDate = startOfDay(new Date())
            endDate = endOfDay(new Date())
            break
        case 'yesterday':
            const y = new Date()
            y.setDate(y.getDate() - 1)
            startDate = startOfDay(y)
            endDate = endOfDay(new Date(y))
            break
        case 'this_week':
            const day = now.getDay()
            const diff = now.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
            startDate = startOfDay(new Date(now.setDate(diff)))
            break
        case '7d':
            startDate.setDate(now.getDate() - 7)
            break
        case 'this_month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            break
        case 'last_month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            endDate = new Date(now.getFullYear(), now.getMonth(), 0) // End of last month
            endDate.setHours(23, 59, 59, 999)
            break
        case '30d':
            startDate.setDate(now.getDate() - 30)
            break
        case 'all':
            startDate = new Date(0)
            break
        case 'custom':
        case 'specific':
            if (customStart) {
                startDate = startOfDay(new Date(customStart))
                if (customEnd) {
                    endDate = endOfDay(new Date(customEnd))
                } else if (range === 'specific') {
                    // For specific date, if end is missing, assume same day
                    endDate = endOfDay(new Date(customStart))
                }
            }
            break
        default:
            // Check if range is a year (e.g., "2024")
            if (/^\d{4}$/.test(range)) {
                startDate = new Date(parseInt(range), 0, 1)
                endDate = new Date(parseInt(range), 11, 31, 23, 59, 59)
            } else {
                // Fallback to 30d if unknown
                startDate.setDate(now.getDate() - 30)
            }
            break
    }

    return { startDate, endDate }
}
