export interface Space {
  id: string;
  placeId: string;
  name: string;
  reference: string;
  capacity?: number;
  description?: string;
}

export interface CreateSpaceDto {
  placeId: string;
  name: string;
  reference: string;
  capacity?: number;
  description?: string;
}
