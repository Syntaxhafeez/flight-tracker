"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Activity, AlertCircle, Plane, RadioTower } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import AirportBoard from "@/components/AirportBoard";
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
  const flightResultsRef = useRef<HTMLElement | null>(null);

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
        window.requestAnimationFrame(() => {
          flightResultsRef.current?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "start",
          });
        });
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

        <header className="glass-panel relative overflow-hidden rounded-[30px] border-white/12">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(94,234,212,0.08),transparent_36%,rgba(56,189,248,0.08)_76%,transparent)]" />

          <div className="relative grid gap-5 p-4 sm:p-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:p-6">
            <div className="min-w-0">
              <div className="flex items-center gap-4">
                <div className="relative flex h-18 w-18 shrink-0 items-center justify-center rounded-[24px] border border-accent/30 bg-linear-to-br from-accent to-accent-strong text-accent-foreground shadow-[0_24px_60px_rgba(45,212,191,0.28)] sm:h-20 sm:w-20">
                  <div className="absolute inset-2 rounded-[18px] border border-white/35" />
                  <Plane size={28} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-semibold text-white sm:text-3xl">AeroTrack</h1>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
                      Live
                    </span>
                  </div>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                    Track aircraft, airport movement, route progress, and operational details from real aviation data.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                <HeaderSignal icon={RadioTower} label="Source" value="Aviationstack" />
                <HeaderSignal icon={Activity} label="Mode" value="Live lookup" />
                <HeaderSignal icon={Plane} label="Example" value="6E1271" />
              </div>
            </div>

            <div className="relative rounded-[28px] border border-white/12 bg-[#07111f]/45 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_28px_70px_rgba(1,8,20,0.28)] sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-3 px-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Flight command</p>
                  <p className="mt-1 text-sm text-slate-400">Enter a flight number to open the live map.</p>
                </div>
                <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-slate-300 sm:inline-flex">
                  Real data
                </span>
              </div>
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

        <AirportBoard />

        <section ref={flightResultsRef} className="scroll-mt-4 grid items-start gap-4 xl:grid-cols-[1.55fr_0.95fr]">
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

function HeaderSignal({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Plane;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-16 items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.035] px-3 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] text-accent">
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
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
