"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

import { EnrichedFlightData } from "@/types/flight";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[26px] bg-slate-950/70 text-slate-300 sm:min-h-[520px] xl:min-h-[640px]">
      <Loader2 size={36} className="mb-4 animate-spin text-accent" />
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Initializing radar</p>
    </div>
  ),
});

interface MapProps {
  flightData: EnrichedFlightData | null;
  isLoading: boolean;
}

export default function Map(props: MapProps) {
  return <MapComponent key={props.flightData?.flight.flight.iata ?? "empty-map"} {...props} />;
}
