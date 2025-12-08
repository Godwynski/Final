import { createClient } from "@/utils/supabase/server";
import { getDateRangeFromParams } from "@/utils/dateRange";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import {
  getFilteredAnalytics,
  getActionItems,
  getRecentCases,
  getCachedProfile,
} from "./actions";
import RealtimeListener from "@/components/RealtimeListener";
import ActionRequired from "@/components/ActionRequired";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardControls from "@/components/dashboard/DashboardControls";
import StatsGrid from "@/components/dashboard/StatsGrid";
import DashboardCalendar from "@/components/dashboard/DashboardCalendar";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Dashboard | Blotter System",
  description: "Overview of blotter cases, analytics, and action items",
};

const DashboardCharts = dynamic(
  () => import("@/components/dashboard/DashboardCharts"),
  {
    loading: () => (
      <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
    ),
  },
);
const RecentCasesTable = dynamic(
  () => import("@/components/dashboard/RecentCasesTable"),
  {
    loading: () => (
      <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
    ),
  },
);

export default async function Dashboard(props: {
  searchParams: Promise<{
    range?: string;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const range = searchParams.range || "all";
  const filterType = searchParams.type;
  const filterStatus = searchParams.status;

  // Parse dates consistently using shared util (mostly for custom/specific ranges)
  // We pass these explicit dates to the actions so they don't need to re-parse or guess 'custom' logic
  const { startDate, endDate } = getDateRangeFromParams(
    range,
    // We don't have startDate/endDate directly in searchParams for Main Dashboard usually?
    // Wait, DashboardControls might push 'startDate'/'endDate' params if range is custom/specific.
    // Let's check if SearchParams type includes them. The props above definition says: { range?: string, type?: string, status?: string }
    // I should update props definition to include starDate/endDate
    (searchParams as any).startDate,
    (searchParams as any).endDate,
  );

  // Convert to string for server action if valid dates
  const customStart = startDate ? startDate.toISOString() : undefined;
  const customEnd = endDate ? endDate.toISOString() : undefined;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const cachedProfile = await getCachedProfile(user.id);
  const profile = {
    full_name: cachedProfile?.full_name || null,
    email: user.email!,
  };

  // Fetch filtered analytics and other dashboard data in parallel
  const [analyticsData, actionItems, recentCases] = await Promise.all([
    getFilteredAnalytics(
      range,
      filterType,
      filterStatus,
      customStart,
      customEnd,
    ),
    getActionItems(),
    getRecentCases(range, filterType, filterStatus, customStart, customEnd),
  ]);

  const { stats, comparison, statusData, typeData, trendData } = analyticsData;
  const { staleCases, upcomingHearings } = actionItems;

  // Calculate percentage change for Total Cases
  const totalChange =
    comparison.total > 0
      ? ((stats.total - comparison.total) / comparison.total) * 100
      : 0;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
      <RealtimeListener />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <DashboardHeader userProfile={profile} />
          <DashboardControls analyticsData={analyticsData} />
        </div>
      </div>

      {/* Print Header (Visible only when printing) */}
      <div className="hidden print:block mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Blotter System Report
        </h1>
        <p className="text-gray-500">
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      <StatsGrid stats={stats} range={range} totalChange={totalChange} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Charts & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardCharts
            statusData={statusData}
            typeData={typeData}
            trendData={trendData}
          />

          {/* Recent Cases */}
          <div>
            <RecentCasesTable recentCases={recentCases} />
          </div>
        </div>

        {/* Right Column: Action Hub */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <ActionRequired
              staleCases={staleCases}
              upcomingHearings={upcomingHearings}
            />
            <DashboardCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}
