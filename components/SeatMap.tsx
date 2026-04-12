"use client";

import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { cn } from "@/utils/cn";

type SeatMapLayout = {
  code: string;
  name: string;
  rows: number;
  blocks: string[][];
  cabin: "narrow-body" | "wide-body" | "double-deck";
};

const LAYOUTS: SeatMapLayout[] = [
  {
    code: "A320",
    name: "Airbus A320 family",
    rows: 30,
    blocks: [["A", "B", "C"], ["D", "E", "F"]],
    cabin: "narrow-body",
  },
  {
    code: "A321",
    name: "Airbus A321 family",
    rows: 38,
    blocks: [["A", "B", "C"], ["D", "E", "F"]],
    cabin: "narrow-body",
  },
  {
    code: "B737",
    name: "Boeing 737 family",
    rows: 32,
    blocks: [["A", "B", "C"], ["D", "E", "F"]],
    cabin: "narrow-body",
  },
  {
    code: "B777",
    name: "Boeing 777 family",
    rows: 42,
    blocks: [["A", "B", "C"], ["D", "E", "F", "G"], ["H", "J", "K"]],
    cabin: "wide-body",
  },
  {
    code: "B787",
    name: "Boeing 787 family",
    rows: 34,
    blocks: [["A", "B", "C"], ["D", "E", "F"], ["G", "H", "J"]],
    cabin: "wide-body",
  },
  {
    code: "A350",
    name: "Airbus A350 family",
    rows: 36,
    blocks: [["A", "B", "C"], ["D", "E", "F"], ["G", "H", "J"]],
    cabin: "wide-body",
  },
  {
    code: "A380",
    name: "Airbus A380 main deck economy",
    rows: 48,
    blocks: [["A", "B", "C"], ["D", "E", "F", "G"], ["H", "J", "K"]],
    cabin: "double-deck",
  },
];

export default function SeatMap({
  aircraftType,
  seatNumber,
}: {
  aircraftType: string;
  seatNumber: string;
}) {
  const normalizedType = normalizeAircraftType(aircraftType);
  const layout = LAYOUTS.find((item) => item.code === normalizedType) || null;
  const parsedSeat = parseSeat(seatNumber);

  if (!aircraftType.trim()) {
    return (
      <SeatNotice
        title="Enter an aircraft type"
        text="Try A320, B777, B787, A350, A380, A321, or B737."
      />
    );
  }

  if (!layout) {
    return (
      <SeatNotice
        title="Seat map not available for this type"
        text="Generic seat maps currently support A320, A321, B737, B777, B787, A350, and A380 families."
        tone="warning"
      />
    );
  }

  const validLetters = new Set(layout.blocks.flat());
  const invalidSeat =
    Boolean(seatNumber.trim()) &&
    (!parsedSeat || parsedSeat.row > layout.rows || !validLetters.has(parsedSeat.letter));
  const seatPosition = parsedSeat && !invalidSeat ? getSeatPosition(layout, parsedSeat.letter) : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Cabin preview</p>
          <p className="text-sm text-slate-300">{layout.name}</p>
        </div>
        {parsedSeat && !invalidSeat ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
            <CheckCircle2 size={14} />
            {parsedSeat.row}{parsedSeat.letter} is {seatPosition}
          </div>
        ) : null}
      </div>

      {invalidSeat ? (
        <SeatNotice
          title="Seat not found in this cabin"
          text={`"${seatNumber}" does not fit the selected ${layout.code} generic seat layout.`}
          tone="warning"
        />
      ) : null}

      <div className="overflow-x-auto rounded-[30px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(15,23,42,0.18))] p-3 sm:p-5">
        <div className="min-w-max">
          <div className="mx-auto mb-3 flex w-64 items-center justify-center rounded-t-[90px] border border-white/10 bg-white/[0.04] px-6 py-4 text-center text-xs uppercase tracking-[0.22em] text-slate-400">
            Flight deck
          </div>

          <div
            className={cn(
              "relative rounded-[48px] border border-white/12 bg-slate-950/70 px-7 py-6 shadow-[inset_0_0_50px_rgba(148,163,184,0.08)]",
              layout.cabin === "narrow-body" ? "w-[430px]" : "w-[620px]",
            )}
          >
            <div className="pointer-events-none absolute inset-y-12 left-3 w-1.5 rounded-full bg-sky-200/20 shadow-[0_0_20px_rgba(125,211,252,0.24)]" />
            <div className="pointer-events-none absolute inset-y-12 right-3 w-1.5 rounded-full bg-sky-200/20 shadow-[0_0_20px_rgba(125,211,252,0.24)]" />

            <div className="mb-4 grid grid-cols-[56px_1fr] items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Front</span>
              <div className="flex justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                <span>Galley</span>
                <span>Lav</span>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="grid grid-cols-[34px_1fr] gap-3">
                <div />
                <div className="flex gap-7">
                  {layout.blocks.map((block, index) => (
                    <div
                      key={`${layout.code}-labels-${index}`}
                      className="grid gap-2"
                      style={{ gridTemplateColumns: `repeat(${block.length}, minmax(0, 1fr))` }}
                    >
                      {block.map((letter) => (
                        <div
                          key={`${layout.code}-label-${letter}`}
                          className="flex h-6 min-w-8 items-center justify-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {Array.from({ length: layout.rows }, (_, rowIndex) => {
                const row = rowIndex + 1;
                const isExitRow = row === 12 || row === 13 || row === 20;
                return (
                  <div key={`${layout.code}-row-${row}`} className="grid grid-cols-[34px_1fr] items-center gap-3">
                    <div className="flex h-9 items-center justify-end text-xs text-slate-500">{row}</div>
                    <div className="flex items-center gap-7">
                      {layout.blocks.map((block, blockIndex) => (
                        <div
                          key={`${layout.code}-${row}-${blockIndex}`}
                          className="grid gap-2"
                          style={{ gridTemplateColumns: `repeat(${block.length}, minmax(0, 1fr))` }}
                        >
                          {block.map((letter) => {
                            const isSelected = parsedSeat?.row === row && parsedSeat.letter === letter && !invalidSeat;
                            const position = getSeatPosition(layout, letter);
                            return (
                              <div
                                key={`${layout.code}-${row}-${letter}`}
                                title={`${row}${letter} ${position}`}
                                className={cn(
                                  "relative flex h-9 min-w-8 items-center justify-center rounded-[10px] border text-[11px] font-semibold transition",
                                  "border-slate-700/80 bg-slate-900 text-slate-300 shadow-[inset_0_3px_0_rgba(255,255,255,0.05)]",
                                  "before:absolute before:left-1 before:right-1 before:top-1 before:h-1 before:rounded-full before:bg-white/10",
                                  isExitRow && "border-amber-300/20",
                                  isSelected &&
                                    "border-accent bg-accent/25 text-white shadow-[0_0_0_2px_rgba(34,211,238,0.24),0_0_24px_rgba(34,211,238,0.22)]",
                                )}
                              >
                                {letter}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center text-[10px] uppercase tracking-[0.18em] text-slate-500">
              <span>Rear galley</span>
              <span>Lavatories</span>
              <span>Exit zone</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeAircraftType(input: string) {
  const value = input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (value.startsWith("A320")) return "A320";
  if (value.startsWith("A321")) return "A321";
  if (value.startsWith("A350")) return "A350";
  if (value.startsWith("A380")) return "A380";
  if (value.startsWith("B777") || value.startsWith("777")) return "B777";
  if (value.startsWith("B787") || value.startsWith("787")) return "B787";
  if (value.startsWith("B737") || value.startsWith("737")) return "B737";
  return value;
}

function parseSeat(input: string) {
  const match = input.trim().toUpperCase().match(/^(\d{1,2})([A-Z])$/);
  if (!match) return null;
  return {
    row: Number(match[1]),
    letter: match[2],
  };
}

function getSeatPosition(layout: SeatMapLayout, letter: string) {
  const firstBlock = layout.blocks[0];
  const lastBlock = layout.blocks[layout.blocks.length - 1];

  if (letter === firstBlock[0] || letter === lastBlock[lastBlock.length - 1]) {
    return "window seat";
  }

  const isAisle = layout.blocks.some((block, index) => {
    const isFirstBlock = index === 0;
    const isLastBlock = index === layout.blocks.length - 1;
    return (
      (!isLastBlock && letter === block[block.length - 1]) ||
      (!isFirstBlock && letter === block[0])
    );
  });

  return isAisle ? "aisle seat" : "middle seat";
}

function SeatNotice({
  title,
  text,
  tone = "neutral",
}: {
  title: string;
  text: string;
  tone?: "neutral" | "warning";
}) {
  const isWarning = tone === "warning";
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-4 text-sm",
        isWarning ? "border-amber-400/20 bg-amber-400/10 text-amber-100" : "border-white/8 bg-white/[0.03] text-slate-300",
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle size={16} className={isWarning ? "text-amber-300" : "text-accent"} />
        <div>
          <p className="font-medium">{title}</p>
          <p className={cn("mt-1", isWarning ? "text-amber-100/80" : "text-slate-400")}>{text}</p>
        </div>
      </div>
    </div>
  );
}
