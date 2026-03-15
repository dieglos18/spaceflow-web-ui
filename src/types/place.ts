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
