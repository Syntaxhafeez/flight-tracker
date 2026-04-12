"use client";

import React, { useEffect, useState } from "react";
import { Rows3 } from "lucide-react";

import SeatMap from "@/components/SeatMap";

interface SeatMapPanelProps {
  aircraftDisplayName?: string | null;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function SeatMapPanel({
  aircraftDisplayName = null,
  defaultOpen = false,
  onOpenChange,
}: SeatMapPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [aircraftType, setAircraftType] = useState(() => extractSeatMapType(aircraftDisplayName || ""));
  const [seatNumber, setSeatNumber] = useState("");

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  return (
    <section className="glass-panel rounded-[30px] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05] text-accent">
            <Rows3 size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Seat map</p>
            <p className="text-sm text-slate-300">Open aircraft cabin view and highlight a seat</p>
          </div>
        </div>
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-accent/40 hover:bg-accent/10"
        >
          {isOpen ? "Close seat map" : "Open seat map"}
        </button>
      </div>

      {isOpen ? (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={aircraftType}
              onChange={(e) => setAircraftType(e.target.value)}
              placeholder="Aircraft type, e.g. A320"
              className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <input
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value.toUpperCase())}
              placeholder="Seat number"
              className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm uppercase tracking-[0.18em] text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="mt-4">
            <SeatMap aircraftType={aircraftType} seatNumber={seatNumber} />
          </div>
        </>
      ) : null}
    </section>
  );
}

function extractSeatMapType(label: string) {
  const normalized = label.toUpperCase();
  if (normalized.includes("A320")) return "A320";
  if (normalized.includes("A321")) return "A321";
  if (normalized.includes("A350")) return "A350";
  if (normalized.includes("A380")) return "A380";
  if (normalized.includes("B777") || normalized.includes("777")) return "B777";
  if (normalized.includes("B787") || normalized.includes("787")) return "B787";
  if (normalized.includes("B737") || normalized.includes("737")) return "B737";
  return "";
}
