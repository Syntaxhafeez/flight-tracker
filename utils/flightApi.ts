import { EnrichedFlightData } from '@/types/flight';

export async function fetchFlightData(flightIata: string): Promise<{ data?: EnrichedFlightData, error?: string }> {
  try {
    const res = await fetch(`/api/flight?flight_iata=${encodeURIComponent(flightIata)}&_ts=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      if (res.status === 404) {
        return { error: 'Flight not found' };
      }
      const errorPayload = await res.json().catch(() => null);
      return { error: errorPayload?.error || 'Failed to fetch flight data' };
    }
    const data = await res.json();
    if (data.error && !data.data) {
      return { error: data.error };
    }
    return { data: data.data };
  } catch (error) {
    console.error('Error fetching flight data:', error);
    return { error: 'Network problem occurred' };
  }
}
