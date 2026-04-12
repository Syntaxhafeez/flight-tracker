export interface AirportData {
  airport: string;
  timezone: string;
  iata: string;
  icao: string;
  terminal: string | null;
  gate: string | null;
  delay: number | null;
  scheduled: string;
  estimated: string;
  actual: string | null;
  estimated_runway: string | null;
  actual_runway: string | null;
}

export interface AirportReferenceData {
  airport_name: string;
  country_name: string;
  iata_code: string;
  icao_code: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
}

export interface AirlineData {
  name: string;
  iata: string;
  icao: string;
}

export interface FlightDetails {
  number: string;
  iata: string;
  icao: string;
  codeshared: unknown | null;
}

export interface AircraftData {
  registration: string;
  iata: string;
  icao: string;
  icao24: string;
}

export interface LiveData {
  updated: string;
  latitude: number;
  longitude: number;
  altitude: number;
  direction: number;
  speed_horizontal: number;
  speed_vertical: number;
  is_ground: boolean;
}

export interface FlightData {
  flight_date: string;
  flight_status: string; // 'scheduled', 'active', 'landed', 'cancelled', 'incident', 'diverted'
  departure: AirportData;
  arrival: AirportData;
  airline: AirlineData;
  flight: FlightDetails;
  aircraft: AircraftData | null;
  live: LiveData | null;
}

export interface AircraftPhoto {
  title: string;
  imageUrl: string;
  pageUrl: string;
  source: "wikimedia-commons";
}

export interface EnrichedFlightData {
  flight: FlightData;
  departureAirport: AirportReferenceData | null;
  arrivalAirport: AirportReferenceData | null;
  aircraftPhoto: AircraftPhoto | null;
  aircraftDisplayName: string | null;
  telemetrySource: "aviationstack-live" | "estimated-route" | "schedule-only";
}

export interface AviationStackResponse {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: FlightData[];
}
