"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Activity,
  Clock3,
  LocateFixed,
  MapPin,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
} from "lucide-react";
import { motion } from "framer-motion";

import { EnrichedFlightData } from "@/types/flight";
import { cn } from "@/utils/cn";

interface FlightDetailsPanelProps {
  flightData: EnrichedFlightData | null;
  isLoading: boolean;
}

export default function FlightDetailsPanel({
  flightData,
  isLoading,
}: FlightDetailsPanelProps) {
  const [progressNow, setProgressNow] = useState<number | null>(null);

  useEffect(() => {
    if (!flightData) {
      return;
    }

    const updateProgressClock = () => setProgressNow(Date.now());
    const timeout = window.setTimeout(updateProgressClock, 0);
    const interval = window.setInterval(updateProgressClock, 60000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [flightData]);

  if (!flightData) {
    return (
      <section className="glass-panel flex min-h-[420px] items-center justify-center rounded-[30px] p-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            {isLoading ? "Loading" : "No flight selected"}
          </p>
          <p className="mt-3 text-base text-slate-300">
            {isLoading ? "Fetching real flight data..." : "Search a flight number to see live or scheduled details."}
          </p>
        </div>
      </section>
    );
  }

  const { flight, aircraftPhoto, aircraftDisplayName } = flightData;
  const isActive = flight.flight_status === "active" || Boolean(flight.live) || (Boolean(flight.departure.actual) && !flight.arrival.actual);
  const displayStatus = isActive ? "active" : flight.flight_status;
  const statusTone = isActive
    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
    : flight.flight_status === "landed"
      ? "border-white/10 bg-white/[0.06] text-white"
      : "border-sky-400/20 bg-sky-400/10 text-sky-200";

  return (
    <motion.aside
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4"
    >
      <section className="glass-panel overflow-hidden rounded-[30px]">
        {aircraftPhoto ? (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={aircraftPhoto.imageUrl}
              alt={aircraftPhoto.title}
              fill
              sizes="(max-width: 1279px) 100vw, 36vw"
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">{flight.airline.name}</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">
                    {aircraftDisplayName || "Aircraft information"}
                  </h2>
                </div>
                <a
                  href={aircraftPhoto.pageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 bg-black/25 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/80 transition hover:bg-black/40"
                >
                  Photo
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/[0.05] text-accent">
              <Plane size={24} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{flight.airline.name}</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">
                {aircraftDisplayName || "Aircraft information"}
              </h2>
            </div>
          </div>
        )}

        <div className="grid gap-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-sm tracking-[0.18em] text-white">
                  {flight.flight.iata}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                  Flight date {formatFlightDate(flight.flight_date)}
                </span>
                <span
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em]",
                    statusTone,
                  )}
                >
                  {displayStatus}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <AirportCode code={flight.departure.iata} label="Departure" />
                <Plane className="mx-auto text-accent" size={18} />
                <AirportCode code={flight.arrival.iata} label="Arrival" />
              </div>
            </div>
          </div>

          <RouteProgress flightData={flightData} now={progressNow} />

          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard
              icon={PlaneTakeoff}
              label={flight.departure.actual ? "Departed" : "Departure"}
              value={formatTimeOnly(
                flight.departure.actual || flight.departure.estimated || flight.departure.scheduled,
                flight.departure.timezone,
              )}
              detail={`${flight.departure.airport} • ${formatFlightDate(flight.flight_date)} operational date`}
            />
            <MetricCard
              icon={PlaneLanding}
              label={flight.arrival.actual ? "Arrived" : "Arrival"}
              value={formatTimeOnly(
                flight.arrival.actual || flight.arrival.estimated || flight.arrival.scheduled,
                flight.arrival.timezone,
              )}
              detail={`${flight.arrival.airport} • ${formatTimezone(flight.arrival.timezone)}`}
            />
            <MetricCard
              icon={Activity}
              label="Altitude"
              value={
                flight.live
                  ? `${Math.round(flight.live.altitude).toLocaleString()} ft`
                  : "Unavailable"
              }
              detail={
                flight.live
                  ? `${Math.round(flight.live.speed_horizontal)} km/h`
                  : "Provider did not publish live telemetry"
              }
            />
            <MetricCard
              icon={LocateFixed}
              label="Position"
              value={
                flight.live
                  ? `${flight.live.latitude.toFixed(3)}, ${flight.live.longitude.toFixed(3)}`
                  : "Unavailable"
              }
              detail={
                flight.live?.updated
                  ? `Updated ${formatSchedule(flight.live.updated, flight.departure.timezone)}`
                  : "No exact live coordinates returned by provider"
              }
            />
          </div>

          <div className="grid gap-3">
            <DetailRow
              icon={MapPin}
              label="Terminal / Gate"
              value={[flight.departure.terminal ? `T${flight.departure.terminal}` : null, flight.departure.gate ? `Gate ${flight.departure.gate}` : null].filter(Boolean).join(" / ") || "Unavailable"}
            />
            <DetailRow
              icon={Clock3}
              label="Delay"
              value={formatDelay(flight.departure.delay ?? flight.arrival.delay)}
            />
            <DetailRow
              icon={LocateFixed}
              label="Telemetry source"
              value={formatTelemetrySource(flightData.telemetrySource)}
            />
            <DetailRow
              icon={Plane}
              label="Aircraft"
              value={[
                aircraftDisplayName,
                flight.aircraft?.registration,
                flight.aircraft?.icao24,
              ]
                .filter(Boolean)
                .join(" / ") || "Unavailable"}
            />
          </div>
        </div>
      </section>

    </motion.aside>
  );
}

function AirportCode({ code, label }: { code: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-[-0.05em] text-white">{code}</p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof PlaneTakeoff;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05] text-accent">
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
          <p className="mt-1 text-sm font-medium text-white">{value}</p>
          <p className="mt-1 truncate text-sm text-slate-400">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.05] text-accent">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <p className="mt-1 text-sm leading-6 text-white">{value}</p>
      </div>
    </div>
  );
}

function RouteProgress({
  flightData,
  now,
}: {
  flightData: EnrichedFlightData;
  now: number | null;
}) {
  const { flight } = flightData;
  const start = getTimeMs(flight.departure.actual || flight.departure.estimated || flight.departure.scheduled);
  const end = getTimeMs(flight.arrival.actual || flight.arrival.estimated || flight.arrival.scheduled);
  const liveTime = getTimeMs(flight.live?.updated);
  const hasValidRange = start !== null && end !== null && end > start;
  const hasDeparted = Boolean(flight.departure.actual) || flight.flight_status === "active" || Boolean(flight.live);
  const hasLanded = flight.flight_status === "landed" || Boolean(flight.arrival.actual);
  const fallbackTime = start ?? end ?? 0;
  const referenceTime = hasLanded ? (end ?? fallbackTime) : liveTime ?? now ?? fallbackTime;
  const progress = hasValidRange
    ? clamp(((referenceTime - start) / (end - start)) * 100, hasDeparted ? 2 : 0, 100)
    : 0;
  const elapsed = hasValidRange && referenceTime >= start ? referenceTime - start : 0;
  const total = hasValidRange ? end - start : 0;
  const progressLabel = !hasValidRange
    ? "Timeline unavailable"
    : hasLanded
      ? "Flight complete"
      : hasDeparted
        ? `${Math.round(progress)}% of scheduled duration`
        : "Awaiting departure";

  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Route progress</p>
          <p className="mt-1 text-sm font-medium text-white">{progressLabel}</p>
        </div>
        {hasValidRange ? (
          <p className="font-mono text-xs text-slate-400">
            {formatDuration(hasLanded ? total : elapsed)} {hasLanded ? "total" : "elapsed"}
          </p>
        ) : null}
      </div>

      <div className="mt-5">
        <div className="relative h-2 rounded-full bg-slate-800">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-accent to-sky-300"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/40 bg-slate-950 text-accent shadow-[0_0_24px_rgba(34,211,238,0.28)]"
            style={{ left: `${progress}%` }}
          >
            <Plane size={14} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
          <div>
            <p className="uppercase tracking-[0.18em] text-slate-500">Takeoff</p>
            <p className="mt-1 font-medium text-slate-200">
              {formatTimeOnly(flight.departure.actual || flight.departure.estimated || flight.departure.scheduled, flight.departure.timezone)}
            </p>
          </div>
          <div className="text-center">
            <p className="uppercase tracking-[0.18em] text-slate-500">Duration</p>
            <p className="mt-1 font-medium text-slate-200">{hasValidRange ? formatDuration(total) : "Unavailable"}</p>
          </div>
          <div className="text-right">
            <p className="uppercase tracking-[0.18em] text-slate-500">Landing</p>
            <p className="mt-1 font-medium text-slate-200">
              {formatTimeOnly(flight.arrival.actual || flight.arrival.estimated || flight.arrival.scheduled, flight.arrival.timezone)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatSchedule(value?: string | null, timeZone?: string | null) {
  if (!value) return "Unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unavailable";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone || "UTC",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(date);
}

function formatDelay(delay: number | null | undefined) {
  if (delay === null || delay === undefined) return "No delay published";
  if (delay === 0) return "On time";
  return `${delay} min`;
}

function formatFlightDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTelemetrySource(value: "aviationstack-live" | "estimated-route" | "schedule-only") {
  if (value === "aviationstack-live") return "Exact live coordinates from provider";
  return "Schedule and airport data only";
}

function formatTimezone(value?: string | null) {
  if (!value) return "Local time";

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: value,
      timeZoneName: "short",
      hour: "2-digit",
    }).formatToParts(new Date());
    return parts.find((part) => part.type === "timeZoneName")?.value || value;
  } catch {
    return value;
  }
}

function formatTimeOnly(value?: string | null, timeZone?: string | null) {
  if (!value) return "Unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unavailable";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone || "UTC",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(date);
}

function getTimeMs(value?: string | null) {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatDuration(durationMs: number) {
  if (!Number.isFinite(durationMs) || durationMs <= 0) return "0m";

  const totalMinutes = Math.round(durationMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
