import type { AxiosError } from 'axios';

const FALLBACK = 'Something went wrong. Please try again.';

/**
 * Maps known technical API/validation messages to user-friendly text.
 */
function friendlyMessage(raw: string): string {
  const lower = raw.toLowerCase().trim();
  if (lower.includes('endtime') && lower.includes('starttime') && (lower.includes('after') || lower.includes('before'))) {
    return 'Please choose an end time that is after the start time.';
  }
  return raw;
}

/**
 * Maps HTTP status codes to user-friendly messages for non-technical users.
 */
function messageForStatus(status: number): string {
  switch (status) {
    case 401:
      return 'Your session may have expired. Please sign in again.';
    case 403:
      return "You don't have permission to do this.";
    case 404:
      return "We couldn't find this. It may have been removed or doesn't exist.";
    case 409:
      return "This couldn't be completed because it already exists or conflicts with existing data.";
    case 400:
      return 'Please check your information and try again.';
    case 422:
      return 'Please check your information and try again.';
    case 500:
    case 502:
    case 503:
      return 'Something went wrong on our side. Please try again in a few minutes.';
    default:
      return FALLBACK;
  }
}

/**
 * Extracts a user-friendly error message from API errors for UI feedback.
 * Messages are suitable for non-technical users (no raw status codes or stack traces).
 */
export function getApiErrorMessage(error: unknown, fallback = FALLBACK): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const dataMessage = axiosError.response?.data?.message;
    if (typeof dataMessage === 'string' && dataMessage.trim()) return friendlyMessage(dataMessage);
    const status = axiosError.response?.status;
    if (typeof status === 'number') return messageForStatus(status);
  }

  if (error instanceof Error && error.message) {
    const msg = error.message;
    if (msg === 'Network Error' || msg.toLowerCase().includes('network')) {
      return "We couldn't connect. Check your internet connection and try again.";
    }
    if (msg.toLowerCase().includes('timeout') || msg.includes('ECONNABORTED')) {
      return 'The request took too long. Please try again.';
    }
  }

  return fallback;
}
