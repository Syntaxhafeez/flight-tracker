import { NextResponse } from "next/server";

import type {
  AirportBoardData,
  AirportBoardFlight,
  AirportBoardMode,
  AviationStackResponse,
  FlightData,
} from "@/types/flight";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const airportCode = searchParams.get("airport_iata")?.trim().toUpperCase();
  const requestedMode = searchParams.get("mode")?.trim().toLowerCase();
  const mode: AirportBoardMode = requestedMode === "arrival" ? "arrival" : "departure";

  if (!airportCode || !/^[A-Z]{3}$/.test(airportCode)) {
    return NextResponse.json(
      { error: "Enter a valid 3-letter airport IATA code." },
      { status: 400 },
    );
  }

  const apiKey = process.env.AVIATIONSTACK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Live aviation API key is missing. Configure AVIATIONSTACK_API_KEY." },
      { status: 500 },
    );
  }

  try {
    const flights = await fetchAirportFlights(apiKey, airportCode, mode);

    if (!flights.length) {
      return NextResponse.json(
        { error: `No live ${mode} records found for ${airportCode}.` },
        {
          status: 404,
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        },
      );
    }

    const data: AirportBoardData = {
      airportCode,
      mode,
      generatedAt: new Date().toISOString(),
      flights: flights.map((flight) => normalizeAirportFlight(flight, mode)),
    };

    return NextResponse.json(
      { data },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error: unknown) {
    console.error("Airport board API error:", error);
    const message = error instanceof Error ? error.message : "Unable to fetch live airport data.";
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

async function fetchAirportFlights(
  apiKey: string,
  airportCode: string,
  mode: AirportBoardMode,
): Promise<FlightData[]> {
  const flightsUrl = new URL("http://api.aviationstack.com/v1/flights");
  flightsUrl.searchParams.set("access_key", apiKey);
  flightsUrl.searchParams.set(mode === "departure" ? "dep_iata" : "arr_iata", airportCode);
  flightsUrl.searchParams.set("limit", "40");

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

  return sortFlightsByBoardTime(json.data || [], mode).slice(0, 30);
}

function sortFlightsByBoardTime(flights: FlightData[], mode: AirportBoardMode) {
  return [...flights].sort((a, b) => {
    const timeA = getBoardTimeValue(a, mode);
    const timeB = getBoardTimeValue(b, mode);

    if (timeA === timeB) {
      return getStatusRank(a.flight_status) - getStatusRank(b.flight_status);
    }

    return timeA - timeB;
  });
}

function getBoardTimeValue(flight: FlightData, mode: AirportBoardMode) {
  const airport = mode === "departure" ? flight.departure : flight.arrival;
  const value = airport.actual || airport.estimated || airport.scheduled;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : Number.MAX_SAFE_INTEGER;
}

function getStatusRank(status: string) {
  const ranks: Record<string, number> = {
    active: 1,
    scheduled: 2,
    delayed: 3,
    landed: 4,
    diverted: 5,
    incident: 6,
    cancelled: 7,
  };

  return ranks[status] ?? 99;
}

function normalizeAirportFlight(flight: FlightData, mode: AirportBoardMode): AirportBoardFlight {
  const primaryAirport = mode === "departure" ? flight.departure : flight.arrival;
  const pairedAirport = mode === "departure" ? flight.arrival : flight.departure;
  const time = primaryAirport.actual || primaryAirport.estimated || primaryAirport.scheduled;
  const flightIata = flight.flight.iata || flight.flight.icao || flight.flight.number;

  return {
    id: [
      flight.flight_date,
      flightIata,
      primaryAirport.scheduled,
      pairedAirport.iata,
      mode,
    ]
      .filter(Boolean)
      .join("-"),
    flightDate: flight.flight_date,
    status: flight.flight_status || "unreported",
    time,
    scheduled: primaryAirport.scheduled,
    estimated: primaryAirport.estimated || null,
    actual: primaryAirport.actual || null,
    timezone: primaryAirport.timezone,
    flightNumber: flight.flight.number || "Unavailable",
    flightIata: flightIata || "Unavailable",
    airline: (flight.airline.name || flight.airline.iata || flight.airline.icao || "Unknown airline").trim(),
    airportName: pairedAirport.airport || "",
    airportIata: pairedAirport.iata || "",
    airportTimezone: pairedAirport.timezone || "",
    terminal: primaryAirport.terminal,
    gate: primaryAirport.gate,
    delay: primaryAirport.delay,
    aircraftRegistration: flight.aircraft?.registration || null,
  };
}
