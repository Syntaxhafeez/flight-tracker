"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, Plane } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import FlightDetailsPanel from "@/components/FlightDetailsPanel";
import FlightSearch from "@/components/FlightSearch";
import Map from "@/components/Map";
import SeatMapPanel from "@/components/SeatMapPanel";
import { EnrichedFlightData } from "@/types/flight";
import { fetchFlightData } from "@/utils/flightApi";

export default function Home() {
  const [flightData, setFlightData] = useState<EnrichedFlightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const currentFlightRef = useRef<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("recent-flight-searches");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setRecentSearches(parsed.filter((item): item is string => typeof item === "string"));
      }
    } catch {
      window.localStorage.removeItem("recent-flight-searches");
    }
  }, []);

  const updateRecentSearches = (iata: string) => {
    setRecentSearches((current) => {
      const next = [iata, ...current.filter((item) => item !== iata)].slice(0, 6);
      window.localStorage.setItem("recent-flight-searches", JSON.stringify(next));
      return next;
    });
  };

  const handleSearch = async (iata: string) => {
    const normalized = iata.trim().toUpperCase();
    if (!normalized) return;
    currentFlightRef.current = normalized;

    setIsLoading(true);
    setError(null);
    setIsSeatMapOpen(false);

    try {
      const { data, error: apiError } = await fetchFlightData(normalized);

      if (apiError) {
        setFlightData(null);
        setError(apiError);
        return;
      }

      if (data) {
        setFlightData(data);
        updateRecentSearches(normalized);
      }
    } catch {
      setFlightData(null);
      setError("Unable to load flight data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!flightData?.flight.live) return;

    const flightNumber = flightData.flight.flight.iata;
    const interval = window.setInterval(async () => {
      if (currentFlightRef.current !== flightNumber) return;

      const { data, error: apiError } = await fetchFlightData(flightNumber);
      if (!apiError && data) {
        setFlightData(data);
      }
    }, 60000);

    return () => window.clearInterval(interval);
  }, [flightData?.flight.flight.iata, flightData?.flight.live]);

  return (
    <main className="min-h-screen px-3 py-3 sm:px-5 sm:py-5 lg:px-6">
      <div className="mx-auto flex w-full max-w-400 flex-col gap-4">
        <AdSlot
          imageSrc="/GBS Website banner 2181X267.png"
          imageAlt="Advertisement banner"
          width={2181}
          height={267}
          priority
        />

        <header className="glass-panel rounded-[28px] px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-accent to-accent-strong text-accent-foreground shadow-[0_18px_35px_rgba(45,212,191,0.25)]">
                <Plane size={20} />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-[-0.04em] text-white">AeroTrack</h1>
                <p className="text-sm text-white/60">Live flight tracking</p>
              </div>
            </div>

            <div className="w-full lg:max-w-2xl">
              <FlightSearch
                onSearch={handleSearch}
                isLoading={isLoading}
                recentSearches={recentSearches}
              />
            </div>
          </div>
        </header>

        <AnimatePresence>
          {error ? (
            <motion.section
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-panel flex items-start gap-3 rounded-3xl border border-rose/25 bg-rose/10 px-4 py-4 text-sm text-rose-100"
            >
              <AlertCircle className="mt-0.5 shrink-0 text-rose" size={18} />
              <p>{error}</p>
            </motion.section>
          ) : null}
        </AnimatePresence>

        <section className="grid items-start gap-4 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="glass-panel overflow-hidden rounded-[30px] p-2 sm:p-3"
            >
              <Map flightData={flightData} isLoading={isLoading} />
            </motion.div>

            {isSeatMapOpen ? <BrandAdRail /> : null}
          </div>

          <div className="flex min-h-105 flex-col gap-4">
            <FlightDetailsPanel flightData={flightData} isLoading={isLoading} />
            <SeatMapPanel
              key={flightData?.flight.flight.iata ?? "seatmap"}
              aircraftDisplayName={flightData?.aircraftDisplayName ?? null}
              defaultOpen
              onOpenChange={setIsSeatMapOpen}
            />
          </div>
        </section>

        <AdSlot
          imageSrc="/GBS 720X90.png"
          imageAlt="Advertisement banner"
          width={720}
          height={90}
        />
      </div>
    </main>
  );
}

const brandAds = [
  {
    brand: "Amazon",
    title: "Travel essentials for the next connection",
    text: "Cabin bags, adapters, headphones, and comfort gear selected for frequent flyers.",
    cta: "Shop travel",
    siteUrl: "https://www.amazon.com",
    accent: "#FF9900",
    previews: ["#0f172a", "#1f2937", "#374151"],
  },
  {
    brand: "Google",
    title: "Airport routes and local discovery",
    text: "Find places, routes, and travel tools before you reach the arrival gate.",
    cta: "Explore tools",
    siteUrl: "https://www.google.com",
    accent: "#4285F4",
    previews: ["#0b1020", "#1d2a44", "#2b3b64"],
  },
  {
    brand: "Samsung",
    title: "Galaxy devices for long journeys",
    text: "Phones, tablets, watches, and accessories built for work and entertainment in transit.",
    cta: "See devices",
    siteUrl: "https://www.samsung.com",
    accent: "#1D4ED8",
    previews: ["#0c142e", "#1b2d5a", "#2a4384"],
  },
  {
    brand: "Wise",
    title: "Spend and move money abroad",
    text: "International payments and travel spending tools for cross-border trips.",
    cta: "View options",
    siteUrl: "https://wise.com",
    accent: "#00B67A",
    previews: ["#0c2a23", "#0f3b31", "#0e4a37"],
  },
];

function BrandAdRail() {
  return (
    <aside
      aria-label="Sponsored"
      className="hidden xl:block"
    >
      <div className="rounded-3xl border border-white/10 bg-[#0b1220] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Sponsored</span>
          <span className="text-xs text-slate-500">Recommended for travel</span>
        </div>
        <div className="grid gap-3 2xl:grid-cols-4">
          {brandAds.map((ad) => (
            <article
              key={ad.brand}
              className="flex min-h-44 flex-col justify-between rounded-2xl border border-slate-700/60 bg-white p-4 text-slate-950 shadow-[0_10px_30px_rgba(15,23,42,0.12)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: ad.accent }}
                  >
                    {ad.brand.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-base font-semibold tracking-[-0.03em]">{ad.brand}</p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Sponsored</p>
                  </div>
                </div>
                <a
                  href={ad.siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:border-slate-300"
                >
                  Details
                </a>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold leading-5">{ad.title}</p>
                <p className="mt-2 text-xs leading-5 text-slate-600">{ad.text}</p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {ad.previews.map((color, index) => (
                    <div
                      key={`${ad.brand}-preview-${index}`}
                      className="h-10 w-14 rounded-lg border border-slate-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <a
                  href={ad.siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
                >
                  {ad.cta}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}

function AdSlot({
  imageSrc,
  imageAlt,
  width,
  height,
  priority = false,
}: {
  imageSrc: string;
  imageAlt: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  return (
    <section aria-label="Sponsored" className="overflow-hidden rounded-[18px] bg-transparent">
      <div className="relative w-full overflow-hidden bg-black">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={width}
          height={height}
          sizes="100vw"
          className="h-auto w-full"
          priority={priority}
          unoptimized
        />
        <span className="absolute right-2 top-2 rounded-sm bg-black/60 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white/80">
          Sponsored
        </span>
      </div>
    </section>
  );
}
