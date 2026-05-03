"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock3,
  Loader2,
  Plane,
  RadioTower,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import type { AirportBoardData, AirportBoardFlight, AirportBoardMode } from "@/types/flight";
import { fetchAirportBoardData } from "@/utils/airportApi";
import { cn } from "@/utils/cn";

const REFRESH_INTERVAL_MS = 60000;

export default function AirportBoard() {
  const [airportCode, setAirportCode] = useState("");
  const [trackedAirport, setTrackedAirport] = useState("");
  const [mode, setMode] = useState<AirportBoardMode>("departure");
  const [boardData, setBoardData] = useState<AirportBoardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const latestRequestRef = useRef("");

  const loadAirportBoard = async (
    nextAirport: string,
    nextMode: AirportBoardMode,
    options?: { silent?: boolean },
  ) => {
    const normalized = nextAirport.trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(normalized)) {
      setError("Enter a valid 3-letter airport IATA code.");
      return;
    }

    const requestKey = `${normalized}:${nextMode}:${Date.now()}`;
    latestRequestRef.current = requestKey;

    if (!options?.silent) {
      setIsLoading(true);
    }
    setError(null);

    const { data, error: apiError } = await fetchAirportBoardData(normalized, nextMode);
    if (latestRequestRef.current !== requestKey) return;

    if (apiError) {
      if (!options?.silent) {
        setBoardData(null);
      }
      setError(apiError);
    } else if (data) {
      setBoardData(data);
      setTrackedAirport(normalized);
      setAirportCode(normalized);
      setLastUpdatedAt(new Date().toISOString());
    }

    if (!options?.silent) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!trackedAirport) return;

    const interval = window.setInterval(() => {
      loadAirportBoard(trackedAirport, mode, { silent: true });
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [trackedAirport, mode]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = airportCode.trim().toUpperCase();
    setTrackedAirport(normalized);
    loadAirportBoard(normalized, mode);
  };

  const selectMode = (nextMode: AirportBoardMode) => {
    setMode(nextMode);
    loadAirportBoard(trackedAirport || airportCode, nextMode);
  };

  const nextRows = useMemo(() => boardData?.flights ?? [], [boardData?.flights]);
  const delayedCount = useMemo(
    () => nextRows.filter((flight) => flight.delay && flight.delay > 0).length,
    [nextRows],
  );

  return (
    <section className="glass-panel overflow-hidden rounded-[30px]">
      <div className="border-b border-white/10 p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <RadioTower size={18} />
              </span>
              <p className="section-label">Live airport operations</p>
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
              Track real arrivals and departures of airport
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <form onSubmit={handleSubmit} className="min-w-0 sm:w-75">
              <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04]">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={17}
                />
                <input
                  type="text"
                  value={airportCode}
                  onChange={(event) => setAirportCode(event.target.value.toUpperCase())}
                  placeholder="DEL"
                  aria-label="Airport IATA code"
                  className="h-13 w-full bg-transparent pl-11 pr-27 font-mono text-sm font-semibold uppercase tracking-[0.28em] text-white outline-none placeholder:text-slate-500"
                  maxLength={3}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !airportCode.trim()}
                  className="absolute right-2 top-2 inline-flex h-9 items-center justify-center rounded-2xl bg-accent px-4 text-sm font-semibold text-accent-foreground transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={17} /> : "Track"}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-2 rounded-[22px] border border-white/10 bg-white/[0.04] p-1">
              <ModeButton
                active={mode === "departure"}
                icon={ArrowUpFromLine}
                label="Departure"
                onClick={() => selectMode("departure")}
              />
              <ModeButton
                active={mode === "arrival"}
                icon={ArrowDownToLine}
                label="Arrival"
                onClick={() => selectMode("arrival")}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <BoardStat label="Airport" value={boardData?.airportCode || trackedAirport} />
          <BoardStat label="Flights" value={isLoading && !boardData ? "..." : String(nextRows.length)} />
          <BoardStat label="Delayed" value={String(delayedCount)} />
        </div>
      </div>

      <AnimatePresence>
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mx-4 mt-4 flex items-start gap-3 rounded-2xl border border-rose/25 bg-rose/10 px-4 py-3 text-sm text-rose-100 sm:mx-5"
          >
            <AlertCircle className="mt-0.5 shrink-0 text-rose" size={17} />
            <p>{error}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="p-2 sm:p-3">
        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#07111f]/58">
          <div className="flex min-h-12 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock3 size={16} className="text-accent" />
              <span>
                {lastUpdatedAt ? `Updated ${formatBoardUpdated(lastUpdatedAt)}` : "Connecting to live board"}
              </span>
            </div>
            {isLoading ? (
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent">
                <Loader2 size={14} className="animate-spin" />
                Syncing
              </span>
            ) : (
              <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Aviationstack live</span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-230 border-separate border-spacing-0 text-left">
              <thead className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <BoardHeaderCell>Time</BoardHeaderCell>
                  <BoardHeaderCell>Flight</BoardHeaderCell>
                  <BoardHeaderCell>Airline</BoardHeaderCell>
                  <BoardHeaderCell>{mode === "departure" ? "To" : "From"}</BoardHeaderCell>
                  <BoardHeaderCell>Gate</BoardHeaderCell>
                  <BoardHeaderCell>Status</BoardHeaderCell>
                  <BoardHeaderCell>Delay</BoardHeaderCell>
                  <BoardHeaderCell>Aircraft</BoardHeaderCell>
                </tr>
              </thead>
              <tbody>
                {nextRows.map((flight, index) => (
                  <FlightRow key={`${flight.id}-${index}`} flight={flight} mode={mode} />
                ))}
              </tbody>
            </table>
          </div>

          {!nextRows.length ? (
            <div className="flex min-h-60 items-center justify-center px-5 py-10 text-center">
              <div>
                <Plane className="mx-auto text-slate-500" size={28} />
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-slate-500">
                  {isLoading ? "Loading live board" : "No airport board loaded"}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {isLoading ? "Fetching current Aviationstack records..." : "Enter an airport code and track live data."}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ModeButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof ArrowUpFromLine;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-3 text-xs font-semibold uppercase tracking-[0.16em] transition sm:px-4",
        active
          ? "bg-white text-[#07111f] shadow-[0_16px_34px_rgba(255,255,255,0.16)]"
          : "text-slate-300 hover:bg-white/[0.06] hover:text-white",
      )}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

function BoardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.035] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold tracking-[0.08em] text-white">{value}</p>
    </div>
  );
}

function BoardHeaderCell({ children }: { children: React.ReactNode }) {
  return <th className="border-b border-white/10 px-4 py-3 font-semibold">{children}</th>;
}

function FlightRow({ flight, mode }: { flight: AirportBoardFlight; mode: AirportBoardMode }) {
  return (
    <tr className="group text-sm text-slate-200 transition hover:bg-white/[0.035]">
      <td className="border-b border-white/8 px-4 py-4 align-top">
        <div className="font-mono text-base font-semibold text-white">
          {formatTime(flight.time, flight.timezone)}
        </div>
        <div className="mt-1 text-xs text-slate-500">{formatDate(flight.flightDate)}</div>
      </td>
      <td className="border-b border-white/8 px-4 py-4 align-top">
        <div className="font-mono font-semibold tracking-[0.08em] text-white">{flight.flightIata}</div>
        <div className="mt-1 text-xs text-slate-500">No. {flight.flightNumber || "Unavailable"}</div>
      </td>
      <td className="max-w-62 border-b border-white/8 px-4 py-4 align-top">
        <div className="truncate font-medium text-white">{flight.airline}</div>
      </td>
      <td className="max-w-72 border-b border-white/8 px-4 py-4 align-top">
        <div className="font-mono font-semibold tracking-[0.1em] text-accent">{flight.airportIata}</div>
        <div className="mt-1 truncate text-xs text-slate-400">
          {flight.airportName || (mode === "departure" ? "Destination unavailable" : "Origin unavailable")}
        </div>
      </td>
      <td className="border-b border-white/8 px-4 py-4 align-top">
        <div className="font-medium text-white">{formatTerminalGate(flight.terminal, flight.gate)}</div>
      </td>
      <td className="border-b border-white/8 px-4 py-4 align-top">
        <span
          className={cn(
            "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
            getStatusTone(flight.status),
          )}
        >
          {flight.status}
        </span>
      </td>
      <td className="border-b border-white/8 px-4 py-4 align-top">
        <span className={cn("font-mono", flight.delay ? "text-amber" : "text-slate-400")}>
          {flight.delay ? `${flight.delay}m` : "On time"}
        </span>
      </td>
      <td className="border-b border-white/8 px-4 py-4 align-top">
        <span className="font-mono text-xs text-slate-400">
          {flight.aircraftRegistration || "Unavailable"}
        </span>
      </td>
    </tr>
  );
}

function formatTerminalGate(terminal: string | null, gate: string | null) {
  const terminalLabel = terminal ? `T${terminal}` : null;
  const gateLabel = gate ? `Gate ${gate}` : null;
  return [terminalLabel, gateLabel].filter(Boolean).join(" / ") || "Unavailable";
}

function getStatusTone(status: string) {
  if (status === "active") return "border-emerald-400/25 bg-emerald-400/10 text-emerald-300";
  if (status === "landed") return "border-white/10 bg-white/[0.06] text-white";
  if (status === "cancelled" || status === "incident") return "border-rose/25 bg-rose/10 text-rose-100";
  if (status === "delayed") return "border-amber/25 bg-amber/10 text-amber";
  return "border-sky-400/25 bg-sky-400/10 text-sky-200";
}

function formatTime(value: string, timezone: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone || undefined,
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${value}T00:00:00`));
}

function formatBoardUpdated(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(value));
}
