"use client";

import { useState } from "react";
import { updateUser, adminResetPassword, deleteUser } from "./actions";

type User = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
};

export default function UserRow({ user }: { user: User }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [editedName, setEditedName] = useState(user.full_name || "");
  const [editedRole, setEditedRole] = useState(user.role);

  return (
    <>
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {user.full_name || "N/A"}
        </td>
        <td className="px-6 py-4">{user.email}</td>
        <td className="px-6 py-4">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}
          >
            {user.role}
          </span>
        </td>
        <td className="px-6 py-4" suppressHydrationWarning>
          {new Date(user.created_at).toLocaleDateString()}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Edit
            </button>

            <button
              onClick={() => setIsResetPasswordModalOpen(true)}
              className="font-medium text-yellow-600 dark:text-yellow-500 hover:underline"
            >
              Reset Pass
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="font-medium text-red-600 dark:text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <tr>
          <td colSpan={5} className="p-0">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transform transition-all scale-100">
                <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Edit User
                  </h3>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form
                  action={async (formData) => {
                    await updateUser(formData);
                    setIsEditModalOpen(false);
                  }}
                  className="p-6 space-y-4"
                >
                  <input type="hidden" name="userId" value={user.id} />

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="full_name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <select
                        name="role"
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {editedRole === "admin"
                        ? "✓ Full system access including settings"
                        : "✓ Case management access only"}
                    </p>
                  </div>

                  {/* User Info */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-400">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs">
                        Created: {new Date(user.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!editedName.trim()}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </td>
        </tr>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <tr>
          <td colSpan={5} className="p-0">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
                  <h3 className="text-lg font-bold text-red-900 dark:text-red-400 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Delete User
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Are you sure you want to delete <strong>{user.full_name || user.email}</strong>?
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    This action cannot be undone.
                  </p>
                </div>
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <form action={deleteUser}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600"
                    >
                      Delete User
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}

      {/* Reset Password Confirmation Modal */}
      {isResetPasswordModalOpen && (
        <tr>
          <td colSpan={5} className="p-0">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
                  <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-400 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Reset Password
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Reset password for <strong>{user.full_name || user.email}</strong> to default:
                  </p>
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm">
                    Blotter123!
                  </div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-3">
                    User will be required to change password on next login.
                  </p>
                </div>
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsResetPasswordModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <form action={adminResetPassword}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:bg-yellow-500 dark:hover:bg-yellow-600"
                    >
                      Reset Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
