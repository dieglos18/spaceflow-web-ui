import { apiClient } from './apiClient';
import type { Place, CreatePlaceDto, UpdatePlaceDto } from '@/types';

export async function getPlaces(): Promise<Place[]> {
  const { data } = await apiClient.get<Place[]>('/places');
  return data;
}

export async function getPlaceById(id: string): Promise<Place> {
  const { data } = await apiClient.get<Place>(`/places/${id}`);
  return data;
}

export async function createPlace(body: CreatePlaceDto): Promise<Place> {
  const { data } = await apiClient.post<Place>('/places', body);
  return data;
}

export async function updatePlace(id: string, body: UpdatePlaceDto): Promise<Place> {
  const { data } = await apiClient.put<Place>(`/places/${id}`, body);
  return data;
}

export async function deletePlace(id: string): Promise<void> {
  await apiClient.delete(`/places/${id}`);
}
