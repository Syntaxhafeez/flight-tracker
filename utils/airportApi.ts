import type { AirportBoardData, AirportBoardMode } from "@/types/flight";

export async function fetchAirportBoardData(
  airportIata: string,
  mode: AirportBoardMode,
): Promise<{ data?: AirportBoardData; error?: string }> {
  try {
    const params = new URLSearchParams({
      airport_iata: airportIata,
      mode,
      _ts: Date.now().toString(),
    });

    const res = await fetch(`/api/airport-flights?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorPayload = await res.json().catch(() => null);
      return { error: errorPayload?.error || "Failed to fetch airport data" };
    }

    const payload = await res.json();
    if (payload.error && !payload.data) {
      return { error: payload.error };
    }

    return { data: payload.data };
  } catch (error) {
    console.error("Error fetching airport board data:", error);
    return { error: "Network problem occurred" };
  }
}
