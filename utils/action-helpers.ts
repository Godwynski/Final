/**
 * Toast notification types for consistent user feedback
 * These type definitions ensure consistency across the application
 */

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  type: ToastType;
  message: string;
  duration?: number;
}

/**
 * Standardized result type for server actions
 * Provides consistent response format across all actions
 */
export type ActionResult<T = unknown> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

/**
 * Helper to create success result
 */
export function successResult<T>(data?: T, message?: string): ActionResult<T> {
  return { success: true, data, message };
}

/**
 * Helper to create error result
 */
export function errorResult(error: string): ActionResult {
  return { success: false, error };
}

/**
 * Example usage in server actions:
 *
 * export async function someAction(): Promise<ActionResult<{ id: string }>> {
 *     try {
 *         const result = await database.insert(...)
 *         return successResult({ id: result.id }, 'Created successfully')
 *     } catch (error) {
 *         return errorResult(error instanceof Error ? error.message : 'Unknown error')
 *     }
 * }
 *
 * In client components:
 *
 * const result = await someAction()
 * if (result.success) {
 *     console.log('Success:', result.message, result.data)
 * } else {
 *     console.error('Error:', result.error)
 * }
 */

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
}

/**
 * Format validation errors from Zod
 */
export function formatZodError(error: {
  issues?: Array<{ message?: string }>;
}): string {
  if (error?.issues && Array.isArray(error.issues)) {
    return error.issues[0]?.message || "Validation failed";
  }
  return "Validation failed";
}
