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
          imageAlt="Global Games Show Riyadh banner"
          width={2181}
          height={267}
          priority
          href="https://globalgamesshow.com/riyadh"
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
          imageAlt="Global Blockchain Show Riyadh banner"
          width={720}
          height={90}
          href="https://globalblockchainshow.com/riyadh"
        />
      </div>
    </main>
  );
}

const brandAd = {
  brand: "DPauls.com",
  title: "Premium travel planning and curated holiday packages",
  text:
    "Personalized itineraries, visa guidance, and end-to-end holiday management for business and leisure travel.",
  support: "Dedicated travel consultants with fast quotes and destination expertise.",
  highlights: ["Custom itineraries", "Visa assistance", "Group travel", "24x7 support"],
  variants: [
    {
      title: "Premium travel planning and curated holiday packages",
      text:
        "Personalized itineraries, visa guidance, and end-to-end holiday management for business and leisure travel.",
      support: "Dedicated travel consultants with fast quotes and destination expertise.",
      highlights: ["Custom itineraries", "Visa assistance", "Group travel", "24x7 support"],
    },
    {
      title: "Luxury escapes, corporate travel, and family vacations",
      text:
        "Experience-led journeys with premium stays, guided experiences, and concierge-managed travel schedules.",
      support: "Priority support, itinerary optimization, and real-time itinerary updates.",
      highlights: ["Luxury stays", "Corporate travel", "Family tours", "Concierge support"],
    },
    {
      title: "Visa-ready trips with complete documentation support",
      text:
        "From documentation to embassy timelines, DPauls keeps your visa process aligned with your travel plan.",
      support: "Structured checklists, appointment guidance, and document verification.",
      highlights: ["Visa planning", "Document checks", "Appointment help", "Fast turnaround"],
    },
  ],
  cta: "Explore packages",
  siteUrl: "https://www.dpauls.com",
  accent: "#22c55e",
};

function BrandAdRail() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % brandAd.variants.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const slide = brandAd.variants[activeSlide] ?? brandAd;
  return (
    <aside
      aria-label="Sponsored"
      className="block"
    >
      <div className="rounded-3xl border border-emerald-200/20 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_55%),linear-gradient(135deg,#0a1410,#0f1b15)] p-3 shadow-[0_14px_46px_rgba(10,20,16,0.45)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-100/80 sm:text-[10px]">Sponsored</span>
          <span className="text-[9px] text-emerald-200/70 sm:text-[10px]">Recommended for travel</span>
        </div>
        <a
          href={brandAd.siteUrl}
          target="_blank"
          rel="noreferrer"
          className="group block overflow-hidden rounded-2xl border border-emerald-100/15 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_60%),linear-gradient(135deg,#0a1410,#122016)] text-emerald-50 shadow-[0_12px_36px_rgba(10,20,16,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_44px_rgba(10,20,16,0.7)]"
        >
          <div className="flex flex-col gap-2 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-semibold text-emerald-50"
                  style={{ backgroundColor: "#16a34a" }}
                >
                  {brandAd.brand.slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-[-0.03em]">{brandAd.brand}</p>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-emerald-100/60">Travel agency</p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-100/25 px-2.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-emerald-100/80">
                Visit site
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`slide-${activeSlide}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-sm font-semibold leading-5">{slide.title}</p>
                <p className="mt-1.5 text-xs leading-5 text-emerald-50/80">{slide.text}</p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-2">
              {slide.highlights.slice(0, 1).map((item) => (
                <div
                  key={`${brandAd.brand}-${item}`}
                  className="rounded-full border border-emerald-100/20 bg-emerald-100/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-50/90"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-950">
                {brandAd.cta}
              </span>
              <span className="text-[9px] text-emerald-100/70">Quotes in 24 hours.</span>
            </div>
          </div>
        </a>
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
  href,
}: {
  imageSrc: string;
  imageAlt: string;
  width: number;
  height: number;
  priority?: boolean;
  href: string;
}) {
  const Tag = href ? "a" : "div";
  return (
    <section aria-label="Sponsored" className="overflow-hidden rounded-[18px] bg-transparent">
      <Tag
        href={href}
        target={href ? "_blank" : undefined}
        rel={href ? "noreferrer" : undefined}
        className="relative block w-full overflow-hidden bg-transparent"
        style={{ aspectRatio: `${width}/${height}` }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-contain"
          priority={priority}
          unoptimized
        />
        <span className="absolute right-2 top-1 rounded-sm bg-black/60 px-2 py-1 text-[6px] uppercase tracking-[0.16em] text-white/80 sm:text-[10px]">
          Sponsored
        </span>
      </Tag>
    </section>
  );
}
