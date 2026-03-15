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
