"use client";

import { ResolutionDetails } from "@/types";

export default function ResolutionBanner({
  status,
  resolutionDetails,
  caseId,
}: {
  status: string;
  resolutionDetails: ResolutionDetails | null;
  caseId: string;
}) {
  // Fallback if resolutionDetails is missing but status is set (legacy or manual update)
  const type = resolutionDetails?.type || status;
  const reason =
    resolutionDetails?.reason ||
    resolutionDetails?.agency ||
    resolutionDetails?.terms ||
    "No details recorded.";
  const officer = resolutionDetails?.officer || "Unknown Officer";
  // Date handling updated to direct render with suppressHydrationWarning
  const dateRaw = resolutionDetails?.date
    ? new Date(resolutionDetails.date)
    : null;

  let bgColor = "bg-gray-100 border-gray-200";
  let textColor = "text-gray-800";
  let title = "Case Resolved";
  let printLabel = "Print Record";
  let printUrl = `/dashboard/cases/${caseId}/print/record`;

  switch (type) {
    case "Dismissed":
      bgColor =
        "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
      textColor = "text-red-800 dark:text-red-300";
      title = "CASE DISMISSED";
      printLabel = "Print Dismissal Order";
      printUrl = `/dashboard/cases/${caseId}/print/dismissal`;
      break;
    case "Referred":
      bgColor =
        "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800";
      textColor = "text-blue-800 dark:text-blue-300";
      title = `REFERRED TO ${resolutionDetails?.agency?.toUpperCase() || "AGENCY"}`;
      printLabel = "Print Referral Letter";
      printUrl = `/dashboard/cases/${caseId}/print/referral`;
      break;
    case "Settled":
      bgColor =
        "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
      textColor = "text-green-800 dark:text-green-300";
      title = "AMICABLY SETTLED";
      printLabel = "Print Settlement Agreement";
      printUrl = `/dashboard/cases/${caseId}/print/settlement`;
      break;
    case "Closed":
      bgColor =
        "bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700";
      textColor = "text-gray-800 dark:text-gray-300";
      title = "CASE CLOSED (CFA ISSUED)";
      printLabel = "Print CFA";
      printUrl = `/dashboard/cases/${caseId}/print/cfa`;
      break;
  }

  return (
    <div className={`mb-6 p-6 rounded-lg border ${bgColor} shadow-sm`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-full bg-white dark:bg-gray-800 shadow-sm ${textColor}`}
          >
            {/* Simple Icon Placeholder */}
            <span className="text-2xl font-bold">
              {type === "Dismissed"
                ? "✕"
                : type === "Referred"
                  ? "→"
                  : type === "Settled"
                    ? "✓"
                    : "Archive"}
            </span>
          </div>
          <div>
            <h2
              className={`text-xl font-bold ${textColor} uppercase tracking-wide`}
            >
              {title}
            </h2>
            <p className="mt-1 text-base font-medium text-gray-700 dark:text-gray-300">
              {type === "Referred" ? "Agency:" : "Reason/Terms:"}{" "}
              <span className="font-normal">{reason}</span>
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Action taken by <span className="font-semibold">{officer}</span>{" "}
              on{" "}
              <span suppressHydrationWarning>
                {dateRaw ? dateRaw.toLocaleDateString() : "Unknown Date"}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => window.open(printUrl, "_blank")}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          {printLabel}
        </button>
      </div>
    </div>
  );
}
