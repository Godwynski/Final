"use client";

import { useState } from "react";

const TEMPLATES = {
  Theft:
    "Items stolen:\n- \n\nEstimated Value:\n\nPoint of Entry:\n\nSuspect Description:",
  "Physical Injury":
    "Weapon used (if any):\n\nInjuries sustained:\n\nMedical attention given:",
  Vandalism:
    "Property damaged:\n\nEstimated cost of repair:\n\nDescription of damage:",
  "Child Conflict":
    "Minors involved:\n\nParents/Guardians:\n\nNature of conflict:\n\nInitial agreement:",
  "Noise Complaint":
    "Source of noise:\n\nTime started:\n\nPrevious complaints:\n\nAction taken:",
  Default: "Who:\nWhat:\nWhere:\nWhen:\nWhy/How:",
};

export default function NarrativeEditor() {
  const [facts, setFacts] = useState("");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    keyof typeof TEMPLATES | null
  >(null);

  const handleTemplateClick = (type: keyof typeof TEMPLATES) => {
    if (facts.trim().length > 0) {
      setSelectedTemplate(type);
      setShowTemplateModal(true);
    } else {
      setFacts(TEMPLATES[type]);
    }
  };

  const confirmTemplate = () => {
    if (selectedTemplate) {
      setFacts(TEMPLATES[selectedTemplate]);
      setShowTemplateModal(false);
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center border-b pb-4 mb-6 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          3. Narrative & Action
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleTemplateClick("Default")}
            className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => handleTemplateClick("Theft")}
            className="text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-colors"
          >
            Theft
          </button>
          <button
            type="button"
            onClick={() => handleTemplateClick("Physical Injury")}
            className="text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition-colors"
          >
            Injury
          </button>
          <button
            type="button"
            onClick={() => handleTemplateClick("Child Conflict")}
            className="text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 transition-colors"
          >
            Child Conflict
          </button>
          <button
            type="button"
            onClick={() => handleTemplateClick("Noise Complaint")}
            className="text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50 transition-colors"
          >
            Noise Complaint
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="narrative_facts"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Facts of the Case
          </label>
          <div className="relative">
            <textarea
              name="narrative_facts"
              id="narrative_facts"
              rows={12}
              className="block p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white font-mono leading-relaxed resize-y"
              placeholder="Detail the sequence of events..."
              required
              value={facts}
              onChange={(e) => setFacts(e.target.value)}
            ></textarea>
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">
              Markdown supported
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Describe the sequence of events in detail. You can use the templates
            above to get started.
          </p>
        </div>

        <div>
          <label
            htmlFor="narrative_action"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Action Taken
          </label>
          <textarea
            name="narrative_action"
            id="narrative_action"
            rows={4}
            className="block p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Describe the actions taken by the officer..."
            required
          ></textarea>
        </div>
      </div>

      {/* Template Overwrite Warning Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transform transition-all scale-100">
            <div className="p-6 text-center">
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Apply Template?
              </h3>
              <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                This will replace your current text in the &quot;Facts of the
                Case&quot; section. Are you sure you want to continue?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  No, cancel
                </button>
                <button
                  type="button"
                  onClick={confirmTemplate}
                  className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Yes, apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
