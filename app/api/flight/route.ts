import { NextResponse } from "next/server";

import type {
  AircraftPhoto,
  AirportReferenceData,
  AviationStackResponse,
  EnrichedFlightData,
  FlightData,
} from "@/types/flight";

type AirportsResponse = {
  data?: Array<{
    airport_name: string;
    country_name: string;
    iata_code: string;
    icao_code: string;
    latitude: string | null;
    longitude: string | null;
    timezone: string;
  }>;
};

type AircraftTypesResponse = {
  data?: Array<{
    aircraft_name?: string | null;
    iata_code?: string | null;
    icao_code?: string | null;
  }>;
};

type WikimediaSearchResponse = {
  query?: {
    pages?: Record<
      string,
      {
        title?: string;
        imageinfo?: Array<{
          url?: string;
          descriptionurl?: string;
        }>;
      }
    >;
  };
};

const AIRCRAFT_CODE_NAMES: Record<string, string> = {
  A20N: "Airbus A320neo",
  A320: "Airbus A320",
  A321: "Airbus A321",
  A21N: "Airbus A321neo",
  A359: "Airbus A350-900",
  A35K: "Airbus A350-1000",
  B38M: "Boeing 737 MAX 8",
  B39M: "Boeing 737 MAX 9",
  B737: "Boeing 737",
  B738: "Boeing 737-800",
  B77L: "Boeing 777-200LR",
  B77W: "Boeing 777-300ER",
  B788: "Boeing 787-8 Dreamliner",
  B789: "Boeing 787-9 Dreamliner",
  B78X: "Boeing 787-10 Dreamliner",
  CRJ9: "Bombardier CRJ900",
  E190: "Embraer 190",
  E195: "Embraer 195",
  AT76: "ATR 72-600",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flightIata = searchParams.get("flight_iata")?.trim().toUpperCase();

  if (!flightIata) {
    return NextResponse.json({ error: "Flight number is required." }, { status: 400 });
  }

  const apiKey = process.env.AVIATIONSTACK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Live aviation API key is missing. Configure AVIATIONSTACK_API_KEY." },
      { status: 500 },
    );
  }

  try {
    const flights = await fetchFlights(apiKey, flightIata);

    if (!flights.length) {
      return NextResponse.json({ error: "Flight not found." }, { status: 404 });
    }

    const flight = pickBestFlight(flights);

    const [departureAirport, arrivalAirport, aircraftPhoto, aircraftTypeName] = await Promise.all([
      fetchAirportReference(apiKey, flight.departure.iata),
      fetchAirportReference(apiKey, flight.arrival.iata),
      fetchAircraftPhoto(flight),
      fetchAircraftTypeName(apiKey, flight),
    ]);

    const aircraftDisplayName =
      getAircraftDisplayName(flight) ||
      aircraftTypeName ||
      inferAircraftDisplayNameFromPhoto(aircraftPhoto) ||
      inferAircraftDisplayNameFromFlight(flight);
    const telemetrySource = flight.live ? "aviationstack-live" : "schedule-only";

    const enriched: EnrichedFlightData = {
      flight,
      departureAirport,
      arrivalAirport,
      aircraftPhoto,
      aircraftDisplayName,
      telemetrySource,
    };

    return NextResponse.json(
      { data: enriched },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error: unknown) {
    console.error("Flight API error:", error);
    const message = error instanceof Error ? error.message : "Unable to fetch live flight data.";
    return NextResponse.json(
      { error: message },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }
}

async function fetchFlights(apiKey: string, flightIata: string): Promise<FlightData[]> {
  const primary = await fetchFlightsByParams(apiKey, { flight_iata: flightIata });
  if (primary.length > 0) return primary;

  const parsed = flightIata.match(/^([A-Z]{2,3})(\d{1,4}[A-Z]?)$/);
  if (!parsed) return [];

  const [, carrier, number] = parsed;
  const fallbackKey = carrier.length === 2 ? "airline_iata" : "airline_icao";

  return fetchFlightsByParams(apiKey, {
    [fallbackKey]: carrier,
    flight_number: number,
  });
}

async function fetchFlightsByParams(
  apiKey: string,
  params: Record<string, string>,
): Promise<FlightData[]> {
  const flightsUrl = new URL("http://api.aviationstack.com/v1/flights");
  flightsUrl.searchParams.set("access_key", apiKey);
  Object.entries(params).forEach(([key, value]) => flightsUrl.searchParams.set(key, value));

  const response = await fetch(flightsUrl.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`AviationStack returned ${response.status}.`);
  }

  const json = (await response.json()) as AviationStackResponse & {
    error?: { message?: string; code?: string };
  };

  if (json.error) {
    throw new Error(json.error.message || json.error.code || "Aviation API error.");
  }

  return json.data || [];
}

function pickBestFlight(flights: FlightData[]) {
  const ranked = [...flights].sort((a, b) => {
    const scoreA = getFlightScore(a);
    const scoreB = getFlightScore(b);
    return scoreB - scoreA;
  });

  return ranked[0];
}

function getFlightScore(flight: FlightData) {
  const statusWeight: Record<string, number> = {
    active: 1_000_000,
    scheduled: 200_000,
    landed: 500_000,
    delayed: 350_000,
    incident: 250_000,
    diverted: 220_000,
    cancelled: 100_000,
  };

  const now = Date.now();
  const departureTime =
    new Date(flight.departure.actual || flight.departure.estimated || flight.departure.scheduled).getTime() || 0;
  const arrivalTime =
    new Date(flight.arrival.actual || flight.arrival.estimated || flight.arrival.scheduled).getTime() || 0;
  const liveUpdatedTime = new Date(flight.live?.updated || 0).getTime() || 0;
  const closestTime = [departureTime, arrivalTime, liveUpdatedTime]
    .filter(Boolean)
    .reduce((best, value) => {
      if (best === 0) return value;
      return Math.abs(value - now) < Math.abs(best - now) ? value : best;
    }, 0);

  let score = statusWeight[flight.flight_status] || 50_000;

  if (flight.live) {
    score += 900_000;
  }

  if (flight.departure.actual && !flight.arrival.actual) {
    score += 700_000;
  }

  if (flight.flight_status === "scheduled" && departureTime > now + 6 * 60 * 60 * 1000) {
    score -= 250_000;
  }

  if (flight.flight_status === "landed" && arrivalTime < now + 2 * 60 * 60 * 1000) {
    score += 120_000;
  }

  if (closestTime) {
    score -= Math.floor(Math.abs(closestTime - now) / 60_000);
  }

  return score;
}

async function fetchAirportReference(apiKey: string, iata: string): Promise<AirportReferenceData | null> {
  if (!iata) return null;

  const url = new URL("http://api.aviationstack.com/v1/airports");
  url.searchParams.set("access_key", apiKey);
  url.searchParams.set("iata_code", iata);

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) return null;

  const json = (await response.json()) as AirportsResponse;
  const airport = json.data?.[0];

  if (!airport) return null;

  return {
    airport_name: airport.airport_name,
    country_name: airport.country_name,
    iata_code: airport.iata_code,
    icao_code: airport.icao_code,
    latitude: parseCoordinate(airport.latitude),
    longitude: parseCoordinate(airport.longitude),
    timezone: airport.timezone,
  };
}

async function fetchAircraftTypeName(apiKey: string, flight: FlightData): Promise<string | null> {
  const code = flight.aircraft?.iata || flight.aircraft?.icao;
  if (!code) return null;

  const known = getAircraftDisplayName(flight);
  if (known) return known;

  const url = new URL("http://api.aviationstack.com/v1/aircraft_types");
  url.searchParams.set("access_key", apiKey);
  url.searchParams.set("search", code);

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) return null;

  const json = (await response.json()) as AircraftTypesResponse;
  const match = json.data?.find((item) => item.iata_code === code || item.icao_code === code) || json.data?.[0];
  return match?.aircraft_name?.trim() || null;
}

function parseCoordinate(value: string | null) {
  if (!value) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getAircraftDisplayName(flight: FlightData) {
  const code = flight.aircraft?.iata || flight.aircraft?.icao;
  if (!code) return null;
  return AIRCRAFT_CODE_NAMES[code] || code;
}

async function fetchAircraftPhoto(flight: FlightData): Promise<AircraftPhoto | null> {
  const queries = buildAircraftPhotoQueries(flight);

  for (const query of queries) {
    const photo = await searchWikimediaCommons(query);
    if (photo) return photo;
  }

  return null;
}

function buildAircraftPhotoQueries(flight: FlightData) {
  const airline = flight.airline.name?.trim();
  const displayName = getAircraftDisplayName(flight);
  const registration = flight.aircraft?.registration?.trim();
  const code = flight.aircraft?.iata || flight.aircraft?.icao;

  return [
    [airline, displayName].filter(Boolean).join(" "),
    [airline, code].filter(Boolean).join(" "),
    registration ? `${registration} ${airline}` : "",
    airline ? `${airline} aircraft` : "",
  ].filter(Boolean);
}

async function searchWikimediaCommons(query: string): Promise<AircraftPhoto | null> {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", query);
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", "1");
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url");

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) return null;

  const json = (await response.json()) as WikimediaSearchResponse;
  const page = json.query?.pages ? Object.values(json.query.pages)[0] : null;
  const image = page?.imageinfo?.[0];

  if (!page?.title || !image?.url || !image.descriptionurl) return null;

  return {
    title: page.title.replace(/^File:/, ""),
    imageUrl: image.url,
    pageUrl: image.descriptionurl,
    source: "wikimedia-commons",
  };
}

function inferAircraftDisplayNameFromPhoto(photo: AircraftPhoto | null) {
  if (!photo) return null;

  const normalized = photo.title.replace(/[_-]+/g, " ");
  const known = Object.values(AIRCRAFT_CODE_NAMES).find((name) =>
    normalized.toLowerCase().includes(name.toLowerCase()),
  );

  if (known) return known;

  const airbusMatch = normalized.match(/Airbus\s+A\d{3}(?:neo)?/i);
  if (airbusMatch) return airbusMatch[0];

  const boeingMatch = normalized.match(/Boeing\s+7\d{2}(?:-\d{3}(?:ER|LR)?)?/i);
  if (boeingMatch) return boeingMatch[0];

  return null;
}

function inferAircraftDisplayNameFromFlight(flight: FlightData) {
  if (flight.airline.name) {
    return `${flight.airline.name} aircraft`;
  }

  return "Aircraft information";
}
