"use client";

import React, { useState } from "react";
import { Loader2, Search } from "lucide-react";

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
            "relative overflow-hidden rounded-[22px] border bg-white/[0.03] transition-all duration-300",
            isFocused
              ? "border-accent/60 shadow-[0_0_0_4px_rgba(34,211,238,0.08)]"
              : "border-white/10",
          )}
        >
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={18} className={cn(isFocused && "text-accent")} />
          </div>
          <input
            type="text"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search flight, e.g. 6E1271"
            className="h-14 w-full bg-transparent pl-12 pr-28 text-sm font-medium uppercase tracking-[0.22em] text-white outline-none placeholder:tracking-[0.12em] placeholder:text-slate-500 sm:text-base"
            disabled={isLoading}
            maxLength={8}
          />
          <button
            type="submit"
            disabled={!flightNumber.trim() || isLoading}
            className="absolute right-2 top-2 inline-flex h-10 items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-accent-strong px-4 text-sm font-semibold text-accent-foreground shadow-[0_18px_30px_rgba(34,211,238,0.22)] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Track"}
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
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:border-accent/40 hover:bg-accent/10 hover:text-white"
            >
              {search}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
