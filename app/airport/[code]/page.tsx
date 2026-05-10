import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock3,
  MapPin,
  Plane,
  RadioTower,
  Route,
} from "lucide-react";

import AirportBoard from "@/components/AirportBoard";
import type { AirportBoardMode } from "@/types/flight";
import { airportSeoProfiles, getAirportSeoProfile } from "@/utils/airportSeo";

const siteUrl = "https://aerotrackr.online";

type AirportPageProps = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ mode?: string }>;
};

export function generateStaticParams() {
  return airportSeoProfiles.map((airport) => ({ code: airport.slug }));
}

export async function generateMetadata({ params }: AirportPageProps): Promise<Metadata> {
  const { code } = await params;
  const airport = getAirportSeoProfile(code);

  if (!airport) {
    return {
      title: "Airport live arrivals and departures",
    };
  }

  const title = `${airport.city} Airport ${airport.code} Live Arrivals, Departures and Delays`;
  const description = `Track ${airport.city} Airport ${airport.code} live arrivals and departures with flight status, airlines, terminals, gates, delay information, and today's airport board.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/airport/${airport.slug}`,
    },
    keywords: [
      `${airport.city} airport arrivals`,
      `${airport.city} airport departures`,
      `${airport.city} airport live status`,
      `${airport.city} airport delays`,
      `${airport.code} arrivals`,
      `${airport.code} departures today`,
      `${airport.code} flight status`,
      `${airport.airportName} live board`,
    ],
    openGraph: {
      type: "website",
      url: `${siteUrl}/airport/${airport.slug}`,
      title,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${airport.city} Airport live board` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/twitter-image"],
    },
  };
}

export default async function AirportSeoPage({ params, searchParams }: AirportPageProps) {
  const [{ code }, query] = await Promise.all([params, searchParams]);
  const airport = getAirportSeoProfile(code);

  if (!airport) notFound();

  const mode: AirportBoardMode = query.mode === "arrival" ? "arrival" : "departure";
  const pageUrl = `${siteUrl}/airport/${airport.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Airport",
        name: airport.airportName,
        iataCode: airport.code,
        address: {
          "@type": "PostalAddress",
          addressLocality: airport.city,
          addressCountry: airport.country,
        },
        url: pageUrl,
        description: `${airport.airportName} live arrivals, departures, airport status, and delay information on AeroTrack.`,
      },
      {
        "@type": "WebPage",
        name: `${airport.city} Airport ${airport.code} live arrivals and departures`,
        url: pageUrl,
        description: `Live airport board for ${airport.city} Airport with arrivals, departures, delays, terminal, gate, airline, flight number, and aircraft information.`,
        isPartOf: {
          "@type": "WebSite",
          name: "AeroTrack",
          url: siteUrl,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `How do I check ${airport.city} Airport arrivals?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Use the ${airport.code} live airport board on AeroTrack and switch to arrivals to see inbound flights, airline names, expected time, status, delays, and available gate or terminal details.`,
            },
          },
          {
            "@type": "Question",
            name: `How do I check ${airport.city} Airport departures today?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Open the ${airport.code} airport page and select departures to view outbound flights, scheduled time, estimated time, airline, destination, gate, terminal, aircraft, and delay information when available.`,
            },
          },
          {
            "@type": "Question",
            name: `Are ${airport.city} Airport delays always exact?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: "Delay values are informational and can change as airlines, airports, weather, air traffic control, and ground operations update flight records. Confirm critical travel decisions with official airline or airport channels.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "AeroTrack", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Airport boards", item: `${siteUrl}/airport-arrivals-departures` },
          { "@type": "ListItem", position: 3, name: `${airport.city} Airport`, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen px-3 py-3 sm:px-5 sm:py-5 lg:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto flex w-full max-w-400 flex-col gap-4">
        <section className="glass-panel relative overflow-hidden rounded-[30px] p-5 sm:p-7">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent" />
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 font-mono text-sm font-bold text-accent">
              {airport.code}
            </span>
            <div>
              <p className="section-label">{airport.city} airport live status</p>
              <p className="mt-1 text-sm text-slate-400">{airport.airportName}, {airport.country}</p>
            </div>
          </div>
          <h1 className="mt-5 max-w-5xl text-3xl font-semibold text-white sm:text-5xl">
            {airport.city} Airport {airport.code} live arrivals and departures
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            Check {airport.city} Airport arrivals, departures today, live flight status, terminal and gate updates, airline
            information, aircraft details, and delay signals in one airport board.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <HeroSignal icon={ArrowDownToLine} label="Arrivals" value={`${airport.code} inbound`} />
            <HeroSignal icon={ArrowUpFromLine} label="Departures" value={`${airport.code} outbound`} />
            <HeroSignal icon={Clock3} label="Updates" value="Live board refresh" />
            <HeroSignal icon={MapPin} label="City" value={airport.city} />
          </div>
        </section>

        <AirportBoard initialAirport={airport.code} initialMode={mode} />

        <section className="grid gap-4 lg:grid-cols-3">
          <InfoCard
            icon={Plane}
            title={`${airport.city} Airport arrivals`}
            text={`Use the arrivals mode to follow flights landing at ${airport.airportName}. The board is useful for pickup planning, connection awareness, airline status checks, and watching estimated landing times when arrival records are available.`}
          />
          <InfoCard
            icon={Route}
            title={`${airport.city} departures today`}
            text={`Use departures mode for outbound flights from ${airport.code}. AeroTrack displays flight numbers, airlines, scheduled and estimated times, destinations, gate and terminal fields, status, and delay minutes when published.`}
          />
          <InfoCard
            icon={AlertTriangle}
            title={`${airport.city} airport delays`}
            text={`Common delay pressure at ${airport.code} can include ${airport.delayFactors.join(", ")}. Always verify boarding, gate, and final departure information with the airline or airport.`}
          />
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">{airport.code} airport details</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{airport.airportName} live flight information</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <h3 className="font-semibold text-white">Airport overview</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{airport.terminalSummary}</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">{airport.trafficSummary}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <h3 className="font-semibold text-white">Popular route context</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {airport.routeFocus.map((route) => (
                  <span key={route} className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                    {airport.city} to {route}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">Search phrases this page answers</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            {airport.city} airport arrivals, departures, live status, and delays
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {airport.popularSearches.map((search) => (
              <div key={search} className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
                <RadioTower className="text-accent" size={17} />
                <p className="mt-3 text-sm font-semibold text-white">{search}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">Live board and airport status guide</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">More airport pages</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Major airport live boards</h2>
            </div>
            <Link
              href="/airport-arrivals-departures"
              className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent transition hover:bg-accent/15"
            >
              Search any airport
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {airportSeoProfiles
              .filter((item) => item.code !== airport.code)
              .slice(0, 9)
              .map((item) => (
                <Link
                  key={item.code}
                  href={`/airport/${item.slug}`}
                  className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4 transition hover:border-accent/35 hover:bg-accent/10"
                >
                  <span className="font-mono text-sm font-bold text-accent">{item.code}</span>
                  <p className="mt-2 text-sm font-semibold text-white">{item.city} Airport</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">Live status</p>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function HeroSignal({ icon: Icon, label, value }: { icon: typeof RadioTower; label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
      <Icon className="text-accent" size={18} />
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: typeof RadioTower; title: string; text: string }) {
  return (
    <article className="glass-panel rounded-[30px] p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-accent">
        <Icon size={19} />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
    </article>
  );
}
