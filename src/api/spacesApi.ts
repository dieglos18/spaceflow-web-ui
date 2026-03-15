import { apiClient } from './apiClient';
import type { Space } from '@/types';

export async function getSpaces(): Promise<Space[]> {
  const { data } = await apiClient.get<Space[]>('/spaces');
  return data;
}

export async function getSpaceById(id: string): Promise<Space> {
  const { data } = await apiClient.get<Space>(`/spaces/${id}`);
  return data;
}
