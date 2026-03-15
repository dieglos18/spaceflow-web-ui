import type { AxiosError } from 'axios';

/**
 * Extracts a user-friendly error message from API errors for UI feedback.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Ha ocurrido un error.'
): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message = axiosError.response?.data?.message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
