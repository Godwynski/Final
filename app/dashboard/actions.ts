'use server'

import { createClient } from '@/utils/supabase/server'

export async function getAnalyticsData() {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_analytics_summary')

    if (error || !data) {
        return { statusData: [], typeData: [], trendData: [] }
    }

    // data is already in the correct format { statusData, typeData, trendData }
    return data as {
        statusData: { name: string; value: number }[]
        typeData: { name: string; value: number }[]
        trendData: { name: string; cases: number }[]
    }
}
