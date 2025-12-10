"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
}: Omit<ConfirmModalProps, "title">) {
  if (!isOpen) return null;

  const colors = {
    danger: {
      icon: "text-red-500 dark:text-red-400",
      button:
        "bg-red-600 hover:bg-red-800 focus:ring-red-300 dark:focus:ring-red-800",
    },
    warning: {
      icon: "text-yellow-500 dark:text-yellow-400",
      button:
        "bg-yellow-600 hover:bg-yellow-800 focus:ring-yellow-300 dark:focus:ring-yellow-800",
    },
    info: {
      icon: "text-blue-500 dark:text-blue-400",
      button:
        "bg-blue-600 hover:bg-blue-800 focus:ring-blue-300 dark:focus:ring-blue-800",
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <svg
            className={`w-12 h-12 mx-auto mb-4 ${colors[type].icon}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {message}
          </h3>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center ${colors[type].button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
