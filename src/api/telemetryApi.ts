import { apiClient } from './apiClient';
import type { TelemetryRecord, PaginatedResponse } from '@/types';

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 10;

export async function getTelemetry(
  page: number = DEFAULT_PAGE,
  size: number = DEFAULT_SIZE,
  spaceId?: string
): Promise<PaginatedResponse<TelemetryRecord>> {
  const { data } = await apiClient.get<PaginatedResponse<TelemetryRecord>>('/telemetry', {
    params: { page, size, ...(spaceId && { spaceId }) },
  });
  return data;
}

export async function getTelemetryById(id: string): Promise<TelemetryRecord> {
  const { data } = await apiClient.get<TelemetryRecord>(`/telemetry/${id}`);
  return data;
}
