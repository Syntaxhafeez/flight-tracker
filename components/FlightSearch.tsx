"use client";

import React, { useState } from "react";
import { ArrowRight, Loader2, Search } from "lucide-react";

import { cn } from "@/utils/cn";

interface FlightSearchProps {
  onSearch: (iata: string) => void;
  isLoading: boolean;
  recentSearches: string[];
}

export default function FlightSearch({
  onSearch,
  isLoading,
  recentSearches,
}: FlightSearchProps) {
  const [flightNumber, setFlightNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!flightNumber.trim() || isLoading) return;
    onSearch(flightNumber.trim());
  };

  const selectPreset = (value: string) => {
    setFlightNumber(value);
    onSearch(value);
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            "relative overflow-hidden rounded-[24px] border bg-[#0b1627]/90 transition-all duration-300",
            isFocused
              ? "border-accent/70 shadow-[0_0_0_5px_rgba(94,234,212,0.08),0_24px_55px_rgba(14,165,233,0.14)]"
              : "border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
          )}
        >
          <div className="pointer-events-none absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-400 sm:left-4 sm:h-12 sm:w-12">
            <Search size={18} className={cn(isFocused && "text-accent")} />
          </div>
          <input
            type="text"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search flight, e.g. 6E1271"
            className="h-16 w-full bg-transparent pl-15 pr-22 text-sm font-semibold uppercase tracking-[0.08em] text-white outline-none placeholder:tracking-[0.08em] placeholder:text-slate-500 sm:h-20 sm:pl-20 sm:pr-38 sm:text-lg sm:tracking-[0.18em] sm:placeholder:tracking-[0.16em]"
            disabled={isLoading}
            maxLength={8}
          />
          <button
            type="submit"
            disabled={!flightNumber.trim() || isLoading}
            className="absolute right-2 top-2 inline-flex h-12 items-center justify-center gap-2 rounded-[18px] bg-linear-to-r from-accent to-accent-strong px-3 text-sm font-bold text-accent-foreground shadow-[0_18px_34px_rgba(34,211,238,0.2)] transition hover:translate-y-[-1px] hover:shadow-[0_26px_52px_rgba(34,211,238,0.3)] disabled:cursor-not-allowed disabled:opacity-60 sm:h-16 sm:px-5"
          >
            {isLoading ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <>
                <span className="sr-only sm:not-sr-only">Track</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </div>
      </form>

      {recentSearches.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {recentSearches.slice(0, 8).map((search) => (
            <button
              key={search}
              type="button"
              onClick={() => selectPreset(search)}
              className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200 transition hover:border-accent/40 hover:bg-accent/10 hover:text-white"
            >
              {search}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
