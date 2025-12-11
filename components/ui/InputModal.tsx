"use client";

import { useState } from "react";

interface EmailOption {
  name: string;
  email: string;
}

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  message: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  inputType?: "text" | "email";
  validateEmail?: boolean;
  emailOptions?: EmailOption[];
  showEmailSelect?: boolean;
}

export default function InputModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  placeholder = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  inputType = "text",
  validateEmail = false,
  emailOptions = [],
  showEmailSelect = false,
}: InputModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const validateInput = () => {
    if (!inputValue.trim()) {
      setError("This field is required");
      return false;
    }

    if (validateEmail && inputType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputValue)) {
        setError("Please enter a valid email address");
        return false;
      }
    }

    return true;
  };

  const handleConfirm = () => {
    if (validateInput()) {
      onConfirm(inputValue);
      setInputValue("");
      setError("");
      onClose();
    }
  };

  const handleClose = () => {
    setInputValue("");
    setError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transform transition-all scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full dark:bg-blue-900">
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="mb-2 text-xl font-bold text-center text-gray-900 dark:text-white">
            {title}
          </h3>

          {/* Message */}
          <p className="mb-4 text-sm text-center text-gray-500 dark:text-gray-400">
            {message}
          </p>

          {/* Email Selection Dropdown */}
          {showEmailSelect && emailOptions.length > 0 && (
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Select Recipient (Optional)
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setInputValue(e.target.value);
                    setError("");
                  }
                }}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-4 focus:outline-none focus:border-blue-500 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-800"
              >
                <option value="">📧 Select from involved parties...</option>
                {emailOptions.map((option, index) => (
                  <option key={index} value={option.email}>
                    {option.name} - {option.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Input Field */}
          <div className="mb-4">
            {showEmailSelect && emailOptions.length > 0 && (
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Or enter email manually:
              </label>
            )}
            <input
              type={inputType}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError("");
              }}
              placeholder={placeholder}
              className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-4 focus:outline-none dark:bg-gray-700 dark:text-white ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-300 dark:border-red-500 dark:focus:ring-red-800"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-300 dark:border-gray-600 dark:focus:ring-blue-800"
              }`}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleConfirm();
                } else if (e.key === "Escape") {
                  handleClose();
                }
              }}
            />
            {error && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
