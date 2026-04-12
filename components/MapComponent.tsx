"use client";

import React, { useEffect } from "react";
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import L, { LatLngTuple } from "leaflet";
import { Activity, LocateFixed, LucideIcon, MapPin, Plane } from "lucide-react";

import { EnrichedFlightData } from "@/types/flight";

interface MapComponentProps {
  flightData: EnrichedFlightData | null;
  isLoading: boolean;
}

function FitToRoute({ points }: { points: LatLngTuple[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) {
      map.setView([20, 0], 2, { animate: true });
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 6, { animate: true });
      return;
    }

    map.fitBounds(points, {
      padding: [48, 48],
      animate: true,
    });
  }, [map, points]);

  return null;
}

export default function MapComponent({ flightData, isLoading }: MapComponentProps) {
  const flight = flightData?.flight ?? null;
  const departurePoint = toPoint(
    flightData?.departureAirport?.latitude ?? null,
    flightData?.departureAirport?.longitude ?? null,
  );
  const arrivalPoint = toPoint(
    flightData?.arrivalAirport?.latitude ?? null,
    flightData?.arrivalAirport?.longitude ?? null,
  );
  const livePoint = flight?.live ? ([flight.live.latitude, flight.live.longitude] as [number, number]) : null;
  const activePoint = livePoint
    || (flight?.flight_status === "landed" ? arrivalPoint : null)
    || departurePoint
    || arrivalPoint;

  const routePoints = [departurePoint, arrivalPoint, livePoint].filter(Boolean) as LatLngTuple[];

  const planeHeading = flight?.live?.direction || 0;

  const planeIcon = L.divIcon({
    html: `
          <div style="position: relative; width: 84px; height: 84px; display: flex; align-items: center; justify-content: center;">
            <div class="radar-ring" style="position: absolute; width: 100%; height: 100%; border-radius: 999px; background: radial-gradient(circle, rgba(37,99,235,0.22) 0%, rgba(37,99,235,0.06) 40%, rgba(37,99,235,0) 74%);"></div>
            <div style="display:flex; align-items:center; justify-content:center; width: 42px; height: 42px; border-radius:999px; background: rgba(255,255,255,0.96); border: 1px solid rgba(37,99,235,0.24); box-shadow: 0 16px 36px rgba(15,23,42,0.28);">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="#2563eb" stroke="#1e3a8a" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${planeHeading + 45}deg)">
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>
              </svg>
            </div>
          </div>
        `,
    className: "",
    iconSize: [84, 84],
    iconAnchor: [42, 42],
  });

  const airportIcon = L.divIcon({
    html: `
          <div style="display:flex; align-items:center; justify-content:center; width: 18px; height: 18px; border-radius:999px; background: rgba(255,255,255,0.98); box-shadow: 0 0 0 5px rgba(255,255,255,0.08), 0 0 26px rgba(255,255,255,0.18);"></div>
        `,
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-3 p-3 sm:p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/72 px-4 py-3 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">World map</p>
            <h2 className="mt-1 text-lg font-semibold tracking-[-0.04em] text-white">
              {flight ? `${flight.departure.iata} to ${flight.arrival.iata}` : "Global airspace"}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <MapBadge
              icon={Activity}
              text={
                isLoading
                  ? "Loading"
                  : flight?.live
                    ? "Live position"
                    : flight
                      ? flight.flight_status === "landed"
                        ? "Arrived"
                        : flight.flight_status === "active"
                          ? "No live position"
                          : "Departure position"
                      : "Idle"
              }
            />
            <MapBadge icon={Plane} text={flight ? flight.flight.iata : "Search a flight"} />
          </div>
        </div>
      </div>

      <div className="h-[58vh] overflow-hidden rounded-[26px] sm:h-[70vh] xl:h-[82vh]">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          worldCopyJump
          preferCanvas
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">Carto</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <FitToRoute points={routePoints} />

          {departurePoint && arrivalPoint ? (
            <Polyline
              positions={[departurePoint, arrivalPoint]}
              pathOptions={{
                color: "#2563eb",
                weight: 2,
                opacity: 0.32,
                dashArray: "6 10",
              }}
            />
          ) : null}

          {departurePoint && livePoint ? (
            <Polyline
              positions={[departurePoint, livePoint]}
              pathOptions={{
                color: "#2563eb",
                weight: 4,
                opacity: 0.92,
              }}
            />
          ) : null}

          {livePoint && arrivalPoint ? (
            <Polyline
              positions={[livePoint, arrivalPoint]}
              pathOptions={{
                color: "#2563eb",
                weight: 2.5,
                opacity: 0.45,
                dashArray: "10 14",
              }}
            />
          ) : null}

          {departurePoint ? (
            <Marker position={departurePoint} icon={airportIcon}>
              <Tooltip permanent direction="top" offset={[0, -10]}>
                {flightData?.departureAirport?.airport_name || flight?.departure.airport || flight?.departure.iata}
              </Tooltip>
            </Marker>
          ) : null}
          {arrivalPoint ? (
            <Marker position={arrivalPoint} icon={airportIcon}>
              <Tooltip permanent direction="top" offset={[0, -10]}>
                {flightData?.arrivalAirport?.airport_name || flight?.arrival.airport || flight?.arrival.iata}
              </Tooltip>
            </Marker>
          ) : null}

          {departurePoint ? (
            <CircleMarker
              center={departurePoint}
              radius={9}
              pathOptions={{ color: "#ffffff", fillColor: "#ffffff", fillOpacity: 0.1, opacity: 0.15 }}
            />
          ) : null}

          {arrivalPoint ? (
            <CircleMarker
              center={arrivalPoint}
              radius={9}
              pathOptions={{ color: "#ffffff", fillColor: "#ffffff", fillOpacity: 0.1, opacity: 0.15 }}
            />
          ) : null}

          {livePoint ? (
            <Marker position={livePoint} icon={planeIcon}>
              <Tooltip permanent direction="top" offset={[0, -16]}>
                {flight?.flight.iata || "Live flight"}
              </Tooltip>
            </Marker>
          ) : null}

          {!livePoint && activePoint ? (
            <CircleMarker
              center={activePoint}
              radius={12}
              pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.24, opacity: 0.82 }}
            />
          ) : null}
        </MapContainer>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 z-20 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
        <MapBadge
          icon={MapPin}
          text={
            flightData?.departureAirport && flightData?.arrivalAirport
              ? `${flightData.departureAirport.airport_name} / ${flightData.arrivalAirport.airport_name}`
              : "Airport coordinates load with flight data"
          }
        />
        {livePoint ? (
          <MapBadge
            icon={LocateFixed}
            text={`${livePoint[0].toFixed(2)}, ${livePoint[1].toFixed(2)}`}
          />
        ) : null}
      </div>
    </div>
  );
}

function MapBadge({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-slate-950/78 px-3 py-2 text-xs text-slate-200 backdrop-blur-md sm:text-sm">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-accent" />
        <span>{text}</span>
      </div>
    </div>
  );
}

function toPoint(lat: number | null, lng: number | null): [number, number] | null {
  if (lat === null || lng === null) return null;
  return [lat, lng];
}
