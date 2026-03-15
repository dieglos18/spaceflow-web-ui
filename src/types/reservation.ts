export interface Reservation {
  id: string;
  spaceId: string;
  placeId?: string;
  clientEmail: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
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
