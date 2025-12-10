"use client";

import { useState, useEffect, useCallback } from "react";
import {
  SiteVisit,
  VisitStats,
  deleteVisit,
  clearOldVisits,
  exportVisitsCSV,
} from "./actions";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Components
import dynamic from "next/dynamic";

// Components
const StatsOverview = dynamic(() => import("./components/StatsOverview"), {
  ssr: false,
});
const TrafficCharts = dynamic(() => import("./components/TrafficCharts"), {
  ssr: false,
});
const DeviceBrowserCharts = dynamic(
  () =>
    import("./components/TrafficCharts").then((mod) => mod.DeviceBrowserCharts),
  { ssr: false },
);
import VisitsFilter from "./components/VisitsFilter";
import VisitsTable from "./components/VisitsTable";

type VisitsClientProps = {
  initialVisits: SiteVisit[];
  initialStats: VisitStats;
  totalCount: number;
  currentPage: number;
  currentLimit: number;
  currentRole: string;
  currentDevice: string;
  currentVisitType: string;
  currentSearch: string;
  currentStartDate: string;
  currentEndDate: string;
  currentSortBy: string;
  currentSortOrder: string;
  currentOs: string;
  currentBrowser: string;
  currentExcludeAdmins: boolean;
};

export default function VisitsClient({
  initialVisits,
  initialStats,
  totalCount,
  currentPage,
  currentLimit,
  currentRole,
  currentDevice,
  currentVisitType,
  currentSearch,
  currentStartDate,
  currentEndDate,
  currentSortBy,
  currentSortOrder,
  currentOs,
  currentBrowser,
  currentExcludeAdmins,
}: VisitsClientProps) {
  const [visits, setVisits] = useState(initialVisits);
  // stats are static from server for now, but could be refetched if we moved to client-side fetching exclusively
  // For now we keep SSR approach for initial load, but client updates might only affect the table part unless we reload.
  // The "auto-refresh" logic currently does window.location.reload() which works fine for this dashboard.

  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const totalPages = Math.ceil(totalCount / currentLimit);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      window.location.reload();
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const updateUrl = useCallback(
    (params: Record<string, string | boolean | number>) => {
      const url = new URL(window.location.href);
      Object.entries(params).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "all"
        ) {
          url.searchParams.set(key, String(value));
        } else {
          url.searchParams.delete(key);
        }
      });
      window.location.href = url.toString();
    },
    [],
  );

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const success = await deleteVisit(id);
    if (success) {
      setVisits(visits.filter((v) => v.id !== id));
      toast.success("Visit record deleted");
      // Optionally reload to update stats, but for single delete might feel too heavy
    } else {
      toast.error("Failed to delete visit record");
    }
    setIsDeleting(null);
  };

  const handleClearOld = async () => {
    if (!confirm("Are you sure you want to delete visits older than 30 days?"))
      return;
    setIsClearing(true);
    const count = await clearOldVisits(30);
    if (count > 0) {
      toast.success(`Deleted ${count} old visit records`);
      window.location.reload();
    } else {
      toast.info("No old records to delete");
    }
    setIsClearing(false);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const csv = await exportVisitsCSV({
        visitType: currentVisitType,
        role: currentRole,
        device: currentDevice,
        startDate: currentStartDate,
        endDate: currentEndDate,
        search: currentSearch,
      });
      if (csv) {
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `visits_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Export downloaded");
      } else {
        toast.error("Failed to export data");
      }
    } catch {
      toast.error("Export failed");
    }
    setIsExporting(false);
  };

  const handleSort = (column: string) => {
    const newOrder =
      currentSortBy === column && currentSortOrder === "desc" ? "asc" : "desc";
    updateUrl({ sortBy: column, sortOrder: newOrder });
  };

  // Pagination helper
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      <StatsOverview stats={initialStats} />

      <VisitsFilter
        filters={{
          search: currentSearch,
          role: currentRole,
          device: currentDevice,
          os: currentOs,
          browser: currentBrowser,
          excludeAdmins: currentExcludeAdmins,
          startDate: currentStartDate,
          endDate: currentEndDate,
        }}
        onUpdate={updateUrl}
        onClear={() => {
          updateUrl({
            search: "",
            role: "all",
            device: "all",
            os: "all",
            browser: "all",
            range: "30d",
            startDate: "",
            endDate: "",
            page: "1",
            excludeAdmins: false,
          });
        }}
        onExport={handleExport}
        onClearOld={handleClearOld}
        onRefresh={() => window.location.reload()}
        isExporting={isExporting}
        isClearing={isClearing}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
      />

      <div className="space-y-6">
        <VisitsTable
          visits={visits}
          onSort={handleSort}
          sortBy={currentSortBy}
          sortOrder={currentSortOrder}
          onDelete={handleDelete}
          deletingId={isDeleting}
        />

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl px-6 py-4 border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * currentLimit + 1}-
                {Math.min(currentPage * currentLimit, totalCount)} of{" "}
                {totalCount}
              </p>
              <select
                value={currentLimit}
                onChange={(e) =>
                  updateUrl({ limit: e.target.value, page: "1" })
                }
                className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="10">10 / page</option>
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
                <option value="100">100 / page</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  updateUrl({ page: String(Math.max(1, currentPage - 1)) })
                }
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map((pageNum, i) =>
                pageNum === "..." ? (
                  <span key={i} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={i}
                    onClick={() => updateUrl({ page: String(pageNum) })}
                    className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white shadow-sm"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  updateUrl({
                    page: String(Math.min(totalPages, currentPage + 1)),
                  })
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <TrafficCharts stats={initialStats} />
      <DeviceBrowserCharts stats={initialStats} />
    </div>
  );
}
