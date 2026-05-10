import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, Building2, Clock3, RadioTower } from "lucide-react";

import AirportBoard from "@/components/AirportBoard";
import LogoIcon from "@/components/LogoIcon";
import type { AirportBoardMode } from "@/types/flight";
import { airportSeoProfiles } from "@/utils/airportSeo";

const siteUrl = "https://aerotrackr.online";

const airportSearchTopics = [
  "airport arrivals today",
  "airport departures today",
  "live airport status",
  "airport delay tracker",
  "flight arrival board",
  "flight departure board",
  "terminal and gate status",
  "airport flight schedule",
  "airport flight tracker",
  "inbound flights",
  "outbound flights",
  "cancelled airport flights",
  "delayed airport flights",
  "airport airline board",
  "IATA airport code lookup",
  "international airport arrivals",
  "domestic airport departures",
  "airport live board",
];

const airportBoardFields = [
  ["Flight number", "The airline flight identifier used by passengers and airline systems."],
  ["Airline", "The operating or marketing airline name attached to the airport board record."],
  ["Origin and destination", "The airport pair that explains where an arriving flight came from or where a departing flight is going."],
  ["Scheduled time", "The planned flight time from the published airport or airline schedule."],
  ["Estimated time", "A revised operational time that may change as the airport and airline update the flight."],
  ["Gate and terminal", "Boarding and arrival location details, often published or changed close to flight time."],
  ["Delay", "A minutes-based signal that helps identify flights running behind the planned schedule."],
  ["Aircraft", "The aircraft registration or identifier when available from the aviation data provider."],
];

export const metadata: Metadata = {
  title: "Live Airport Arrivals and Departures Board",
  description:
    "Track live airport arrivals and departures by IATA code with flight numbers, airlines, times, terminals, gates, status, aircraft, and delay information.",
  alternates: {
    canonical: "/airport-arrivals-departures",
  },
  keywords: [
    "airport arrivals",
    "airport departures",
    "live airport board",
    "flight arrivals board",
    "flight departures board",
    "airport delay tracker",
    "terminal gate flight status",
    "airport live status",
    "arrival departure board",
    "airport schedule today",
    "live airport departures",
    "live airport arrivals",
    "airport terminal status",
    "airport gate status",
    "delayed flights today",
    "cancelled flights airport",
  ],
  openGraph: {
    type: "website",
    url: `${siteUrl}/airport-arrivals-departures`,
    title: "AeroTrack Live Airport Arrivals and Departures",
    description:
      "Search any supported airport IATA code and view live arrivals, departures, gates, terminals, aircraft, and delays.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "AeroTrack airport arrivals departures board" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AeroTrack Airport Board",
    description: "Live arrivals, departures, terminal, gate, status, and delay lookup.",
    images: ["/twitter-image"],
  },
};

export default async function AirportArrivalsDeparturesPage({
  searchParams,
}: {
  searchParams: Promise<{ airport?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const airport = typeof params.airport === "string" ? params.airport.toUpperCase().slice(0, 3) : "";
  const mode: AirportBoardMode = params.mode === "arrival" ? "arrival" : "departure";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "AeroTrack Airport Arrivals and Departures Board",
        applicationCategory: "TravelApplication",
        operatingSystem: "Web",
        url: `${siteUrl}/airport-arrivals-departures`,
        description:
          "A live airport board for airport arrivals and departures, flight status, gates, terminals, airline names, aircraft identifiers, and delay information.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I check airport arrivals and departures?",
            acceptedAnswer: {
              "@type": "Answer",
              text:
                "Enter a three-letter airport IATA code, choose arrivals or departures, and AeroTrack loads current flight records with airline, time, terminal, gate, status, delay, and aircraft details when available.",
            },
          },
          {
            "@type": "Question",
            name: "Why can airport board data change?",
            acceptedAnswer: {
              "@type": "Answer",
              text:
                "Airport and airline operations change because of weather, air traffic control, ground handling, crew, aircraft rotation, and local airport decisions. Always verify critical travel details with official airline or airport channels.",
            },
          },
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
          <p className="section-label">Airport arrivals and departures</p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold text-white sm:text-5xl">
            Live airport board for arrivals, departures, gates, terminals, and delays
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            Search an airport by IATA code to view a live-style operations board. AeroTrack shows flight times, airline
            names, flight numbers, route direction, status, gate and terminal details, aircraft identifiers, and delay
            minutes when those fields are available.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Signal icon={ArrowUpFromLine} label="Departures" value="Outbound flights" />
            <Signal icon={ArrowDownToLine} label="Arrivals" value="Inbound flights" />
            <Signal icon={Clock3} label="Refresh" value="Every 60 seconds" />
          </div>
        </section>

        <AirportBoard initialAirport={airport} initialMode={mode} />

        <section className="grid gap-4 lg:grid-cols-3">
          <InfoCard
            icon={RadioTower}
            title="Live airport operations"
            text="Use departures to check outbound flights and arrivals to check inbound flights. Each row is organized for fast scanning on flight number, airline, time, gate, status, delay, and aircraft."
          />
          <InfoCard
            icon={Building2}
            title="Terminal and gate context"
            text="Gate and terminal fields are shown when the aviation data provider publishes them. Some airports release this data late, change it near boarding, or withhold it until operational decisions are final."
          />
          <InfoCard
            icon={Clock3}
            title="Delay awareness"
            text="Delay minutes reflect available schedule and estimate updates. They can move up or down as weather, air traffic, aircraft rotation, and ground operations evolve."
          />
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">Airport search coverage</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Airport arrival, departure, delay, gate, and terminal searches</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            This airport board is designed for common travel searches such as arrivals today, departures today, live
            airport status, delayed flights, cancelled flights, terminal status, gate information, airline boards, and
            real-time airport operations by IATA airport code.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {airportSearchTopics.map((topic) => (
              <span key={topic} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-slate-300">
                {topic}
              </span>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">Board fields explained</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">What live airport board columns mean</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {airportBoardFields.map(([field, explanation]) => (
              <article key={field} className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
                <h3 className="text-sm font-semibold text-white">{field}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{explanation}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">Popular airport searches</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Supported airports</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {airportSeoProfiles.map((airport) => (
              <Link
                key={airport.code}
                href={`/airport/${airport.slug}`}
                className="rounded-[20px] border border-white/10 bg-white/[0.035] p-3 transition hover:border-accent/35 hover:bg-accent/10"
              >
                <LogoIcon code={airport.code} domain={airport.domain} label={airport.airportName} size={38} />
                <p className="mt-3 text-sm font-semibold text-white">{airport.city} Airport</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{airport.airportName}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">Open board</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Signal({ icon: Icon, label, value }: { icon: typeof RadioTower; label: string; value: string }) {
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
