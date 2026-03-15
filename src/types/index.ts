// Global TypeScript types for the application
// API response types aligned with SpaceFlow backend

export interface Place {
  id: string;
  name: string;
  location: string;
}

export interface CreatePlaceDto {
  name: string;
  location: string;
}

export interface UpdatePlaceDto {
  name?: string;
  location?: string;
}

export interface Space {
  id: string;
  placeId: string;
  name: string;
  reference: string;
  capacity?: number;
  description?: string;
}

export interface Reservation {
  id: string;
  spaceId: string;
  placeId?: string;
  clientEmail: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  size: number;
  total: number;
}

export interface CreateReservationDto {
  spaceId: string;
  placeId?: string;
  clientEmail: string;
  reservationDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm or HH:mm:ss
  endTime: string; // HH:mm or HH:mm:ss
}

export interface UpdateReservationDto extends Partial<CreateReservationDto> {}

export interface TelemetryRecord {
  id: string;
  spaceId: string;
  peopleCount: number;
  temperature: number | null;
  humidity: number | null;
  co2: number | null;
  battery: number | null;
  timestamp: string; // ISO date
}
