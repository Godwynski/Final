"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CASE_WORKFLOW, WorkflowAction } from "@/app/dashboard/cases/workflow";
import { performCaseAction } from "@/app/dashboard/cases/[id]/actions";
import AlertModal from "@/components/ui/AlertModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Hearing } from "@/types";

export default function CaseActionHeader({
  status,
  caseId,
  hearings = [],
}: {
  status: string;
  caseId: string;
  hearings?: Hearing[];
}) {
  const router = useRouter();

  // Filter actions
  const rawActions = CASE_WORKFLOW[status] || [];
  const actions = rawActions.filter((action) => {
    // If action is 'schedule_hearing', check if there's already an active hearing
    if (action.action === "schedule_hearing") {
      const hasActiveHearing = hearings.some((h) =>
        ["Scheduled", "Rescheduled"].includes(h.status),
      );
      return !hasActiveHearing;
    }
    // If action is 'reschedule_hearing', check if there IS an active hearing
    if (action.action === "reschedule_hearing") {
      const hasActiveHearing = hearings.some((h) =>
        ["Scheduled", "Rescheduled"].includes(h.status),
      );
      return hasActiveHearing;
    }
    return true;
  });

  const [selectedAction, setSelectedAction] = useState<WorkflowAction | null>(
    null,
  );
  const [inputVal, setInputVal] = useState("");
  const [hearingType, setHearingType] = useState("Conciliation"); // Default to Conciliation
  const [loading, setLoading] = useState(false);

  const HEARING_TYPES = {
    Conciliation: "Talking together to fix the issue.",
    Mediation: "A guide helps you talk, but you decide.",
    Arbitration: "The official decides for you.",
  };

  // Alert Modal State
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    setAlertState({ isOpen: true, title, message, type });
  };

  const closeAlert = () => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  };

  // Confirm Modal State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
  ) => {
    setConfirmState({ isOpen: true, title, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleActionClick = async (action: WorkflowAction) => {
    if (action.requiresInput) {
      setSelectedAction(action);
      setInputVal("");

      if (action.action === "reschedule_hearing") {
        const activeHearing = hearings.find((h) =>
          ["Scheduled", "Rescheduled"].includes(h.status),
        );
        if (activeHearing) {
          setHearingType(activeHearing.hearing_type);
        } else {
          setHearingType("Conciliation");
        }
      } else {
        setHearingType("Conciliation");
      }
    } else {
      showConfirm(
        `Confirm ${action.label}`,
        `Are you sure you want to ${action.label.toLowerCase()}?`,
        async () => {
          setLoading(true);
          const res = await performCaseAction(caseId, action.action);
          setLoading(false);
          if (res?.error) {
            showAlert("Error", res.error, "error");
          } else {
            if (res?.downloadUrl) {
              // Trigger download
              const link = document.createElement("a");
              link.href = res.downloadUrl;
              link.download = "";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              showAlert(
                "Success",
                res.message || "Document is being downloaded",
                "success",
              );
            } else {
              showAlert(
                "Success",
                res.message || "Action completed successfully",
                "success",
              );
            }
            router.refresh();
          }
        },
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;

    setLoading(true);

    let finalInput = inputVal;
    if (
      ["schedule_hearing", "reschedule_hearing"].includes(selectedAction.action)
    ) {
      finalInput = JSON.stringify({ date: inputVal, type: hearingType });
    }

    const res = await performCaseAction(
      caseId,
      selectedAction.action,
      finalInput,
    );
    setLoading(false);

    if (res?.error) {
      showAlert("Error", res.error, "error");
    } else {
      if (res?.downloadUrl) {
        // Trigger download
        const link = document.createElement("a");
        link.href = res.downloadUrl;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showAlert(
          "Success",
          res.message || "Document is being downloaded",
          "success",
        );
      } else {
        showAlert(
          "Success",
          res.message || "Action completed successfully",
          "success",
        );
      }
      setSelectedAction(null);
      router.refresh();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4 mb-6">
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        message={confirmState.message}
      />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Available Actions
        </h2>
        <div className="flex flex-wrap gap-2 justify-end">
          {actions.length > 0 ? (
            actions.map((action) => (
              <button
                key={action.action}
                onClick={() => handleActionClick(action)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium focus:ring-4 focus:outline-none transition-colors
                                    ${action.variant === "primary" ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" : ""}
                                    ${action.variant === "secondary" ? "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700" : ""}
                                    ${action.variant === "danger" ? "text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" : ""}
                                    ${action.variant === "success" ? "text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" : ""}
                                    ${loading ? "opacity-50 cursor-not-allowed" : ""}
                                `}
                title={action.description || action.label}
              >
                {action.icon && (
                  <span className="mr-2">{/* Icon placeholder */}</span>
                )}
                {action.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">
              No actions available for this status.
            </p>
          )}
        </div>
      </div>

      {/* Modal for Input */}
      {selectedAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {selectedAction.label}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                {["schedule_hearing", "reschedule_hearing"].includes(
                  selectedAction.action,
                ) ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Hearing Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Hearing Type
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(HEARING_TYPES).map(([type, desc]) => (
                          <div
                            key={type}
                            className={`relative flex items-start p-3 rounded-lg border cursor-pointer transition-all ${hearingType === type ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"}`}
                            onClick={() => setHearingType(type)}
                          >
                            <div className="flex items-center h-5">
                              <input
                                type="radio"
                                name="hearing_type"
                                value={type}
                                checked={hearingType === type}
                                onChange={() => setHearingType(type)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                className={`font-medium ${hearingType === type ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-gray-300"}`}
                              >
                                {type}
                              </label>
                              <p className="text-xs font-normal text-gray-500 dark:text-gray-400 mt-0.5">
                                {desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {selectedAction.inputLabel}
                    </label>
                    {selectedAction.inputType === "textarea" ? (
                      <textarea
                        required
                        rows={4}
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      ></textarea>
                    ) : (
                      <input
                        type={
                          selectedAction.inputType === "datetime-local"
                            ? "datetime-local"
                            : selectedAction.inputType
                        }
                        required
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      />
                    )}
                  </>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAction(null)}
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {loading ? "Processing..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
