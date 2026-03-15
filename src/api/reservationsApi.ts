import { apiClient } from './apiClient';
import type { Reservation, PaginatedResponse, CreateReservationDto, UpdateReservationDto } from '@/types';

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 10;

export async function getReservations(
  page: number = DEFAULT_PAGE,
  size: number = DEFAULT_SIZE
): Promise<PaginatedResponse<Reservation>> {
  const { data } = await apiClient.get<PaginatedResponse<Reservation>>('/reservations', {
    params: { page, size },
  });
  return data;
}

export async function createReservation(body: CreateReservationDto): Promise<Reservation> {
  const { data } = await apiClient.post<Reservation>('/reservations', body);
  return data;
}

export async function updateReservation(id: string, body: UpdateReservationDto): Promise<Reservation> {
  const { data } = await apiClient.put<Reservation>(`/reservations/${id}`, body);
  return data;
}

export async function deleteReservation(id: string): Promise<void> {
  await apiClient.delete(`/reservations/${id}`);
}
