"use client";

import { useState } from "react";
import {
  scheduleHearing,
  updateHearingStatus,
  deleteHearing,
} from "@/app/dashboard/cases/[id]/actions";
import { Hearing } from "@/types";

export default function ProceedingsTracker({
  caseId,
  hearings,
  isReadOnly,
}: {
  caseId: string;
  hearings: Hearing[];
  isReadOnly: boolean;
}) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("10:00");
  const [newType, setNewType] = useState("Mediation");
  const [newNotes, setNewNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const dateTimeString = `${newDate}T${newTime}`;
    await scheduleHearing(caseId, dateTimeString, newType, newNotes);
    setLoading(false);
    setIsScheduling(false);
    setNewDate("");
    setNewTime("10:00");
    setNewNotes("");
  };

  const handleStatusUpdate = async (hearingId: string, status: string) => {
    if (confirm(`Mark hearing as ${status}?`)) {
      await updateHearingStatus(
        hearingId,
        caseId,
        status,
        `Marked as ${status}`,
      );
    }
  };

  const handleDelete = async (hearingId: string) => {
    if (confirm("Are you sure you want to delete this hearing record?")) {
      await deleteHearing(hearingId, caseId);
    }
  };

  // Sort hearings: Scheduled first (asc date), then Completed (desc date)
  const sortedHearings = [...hearings].sort((a, b) => {
    if (a.status === "Scheduled" && b.status !== "Scheduled") return -1;
    if (a.status !== "Scheduled" && b.status === "Scheduled") return 1;
    return (
      new Date(b.hearing_date).getTime() - new Date(a.hearing_date).getTime()
    );
  });

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          Proceedings Tracker
        </h2>
        {!isReadOnly &&
          !hearings.some((h) =>
            ["Scheduled", "Rescheduled"].includes(h.status),
          ) && (
            <button
              onClick={() => setIsScheduling(!isScheduling)}
              className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
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
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Schedule Hearing
            </button>
          )}
      </div>

      {/* Schedule Form */}
      {isScheduling && (
        <form
          onSubmit={handleSchedule}
          className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 animate-in fade-in slide-in-from-top-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                min={today}
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <input
                type="time"
                required
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option>Mediation</option>
                <option>Conciliation</option>
                <option>Arbitration</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g., First invitation sent via patrolman"
              className="w-full rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsScheduling(false)}
              className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-1.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Scheduling..." : "Confirm Schedule"}
            </button>
          </div>
        </form>
      )}

      {/* Hearings List */}
      <div className="space-y-3">
        {sortedHearings.length === 0 ? (
          <p className="text-center text-gray-500 italic py-4 text-sm">
            No hearings scheduled yet.
          </p>
        ) : (
          sortedHearings.map((hearing) => (
            <div
              key={hearing.id}
              className={`p-4 rounded-lg border ${
                hearing.status === "Scheduled"
                  ? "bg-white border-blue-200 shadow-sm dark:bg-gray-700 dark:border-blue-800"
                  : "bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                        hearing.status === "Scheduled"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : hearing.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : hearing.status === "No Show"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {hearing.status}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {hearing.hearing_type}
                    </span>
                  </div>
                  <p
                    className="text-sm text-gray-600 dark:text-gray-300"
                    suppressHydrationWarning
                  >
                    {new Date(hearing.hearing_date).toLocaleString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  {hearing.notes && (
                    <p className="text-xs text-gray-500 mt-1 italic dark:text-gray-400">
                      "{hearing.notes}"
                    </p>
                  )}
                </div>

                {!isReadOnly && hearing.status === "Scheduled" && (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() =>
                        handleStatusUpdate(hearing.id, "Completed")
                      }
                      className="text-xs text-green-600 hover:bg-green-50 px-2 py-1 rounded border border-green-200 dark:border-green-800 dark:hover:bg-green-900/30"
                    >
                      ✅ Done
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(hearing.id, "No Show")}
                      className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded border border-red-200 dark:border-red-800 dark:hover:bg-red-900/30"
                    >
                      ❌ No Show
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(hearing.id, "Rescheduled")
                      }
                      className="text-xs text-orange-600 hover:bg-orange-50 px-2 py-1 rounded border border-orange-200 dark:border-orange-800 dark:hover:bg-orange-900/30"
                    >
                      📅 Reset
                    </button>
                    <button
                      onClick={() => {
                        const email = prompt(
                          "Enter recipient email for hearing notice:",
                        );
                        if (email) {
                          // Dynamic import to avoid client-side error if action not ready,
                          // but we imported it at top. However, we need to add it to imports.
                          // For now, let's assume we can add it to imports in next step or use a prop function.
                          // Better to just call the action directly if imported.
                          // I will update imports in ProceedingsTracker.tsx separately.
                          alert("Sending email to " + email + "...");
                          import("@/app/dashboard/cases/[id]/actions").then(
                            (mod) => {
                              mod
                                .sendHearingNotice(hearing.id, email)
                                .then((res) => {
                                  if (res.error) alert("Error: " + res.error);
                                  if (res.success)
                                    alert("Success: " + res.message);
                                });
                            },
                          );
                        }
                      }}
                      className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 dark:hover:bg-blue-900/30"
                    >
                      ✉️ Email Notice
                    </button>
                  </div>
                )}
                {!isReadOnly && hearing.status !== "Scheduled" && (
                  <button
                    onClick={() => handleDelete(hearing.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete Record"
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
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
