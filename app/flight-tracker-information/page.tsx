import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  Clock3,
  Database,
  Plane,
  Radar,
  Route,
  ShieldCheck,
} from "lucide-react";

const siteUrl = "https://aerotrackr.online";

const supportedAirlines = [
  { code: "AA", name: "American Airlines", domain: "aa.com" },
  { code: "DL", name: "Delta Air Lines", domain: "delta.com" },
  { code: "UA", name: "United Airlines", domain: "united.com" },
  { code: "WN", name: "Southwest Airlines", domain: "southwest.com" },
  { code: "BA", name: "British Airways", domain: "britishairways.com" },
  { code: "LH", name: "Lufthansa", domain: "lufthansa.com" },
  { code: "AF", name: "Air France", domain: "airfrance.com" },
  { code: "KL", name: "KLM Royal Dutch Airlines", domain: "klm.com" },
  { code: "EK", name: "Emirates", domain: "emirates.com" },
  { code: "EY", name: "Etihad Airways", domain: "etihad.com" },
  { code: "QR", name: "Qatar Airways", domain: "qatarairways.com" },
  { code: "SQ", name: "Singapore Airlines", domain: "singaporeair.com" },
  { code: "AI", name: "Air India", domain: "airindia.com" },
  { code: "6E", name: "IndiGo", domain: "goindigo.in" },
  { code: "UK", name: "Vistara", domain: "airvistara.com" },
  { code: "IX", name: "Air India Express", domain: "airindiaexpress.com" },
  { code: "TK", name: "Turkish Airlines", domain: "turkishairlines.com" },
  { code: "CX", name: "Cathay Pacific", domain: "cathaypacific.com" },
  { code: "QF", name: "Qantas", domain: "qantas.com" },
  { code: "JL", name: "Japan Airlines", domain: "jal.co.jp" },
  { code: "NH", name: "All Nippon Airways", domain: "ana.co.jp" },
  { code: "TG", name: "Thai Airways", domain: "thaiairways.com" },
  { code: "AC", name: "Air Canada", domain: "aircanada.com" },
  { code: "VS", name: "Virgin Atlantic", domain: "virginatlantic.com" },
];

const supportedAirports = [
  { code: "JFK", name: "John F. Kennedy International Airport", domain: "jfkairport.com" },
  { code: "LAX", name: "Los Angeles International Airport", domain: "flylax.com" },
  { code: "ORD", name: "Chicago O'Hare International Airport", domain: "flychicago.com" },
  { code: "ATL", name: "Hartsfield-Jackson Atlanta International Airport", domain: "atl.com" },
  { code: "LHR", name: "London Heathrow Airport", domain: "heathrow.com" },
  { code: "DXB", name: "Dubai International Airport", domain: "dubaiairports.ae" },
  { code: "DOH", name: "Hamad International Airport", domain: "dohahamadairport.com" },
  { code: "SIN", name: "Singapore Changi Airport", domain: "changiairport.com" },
  { code: "BKK", name: "Suvarnabhumi Airport Bangkok", domain: "suvarnabhumi.airportthai.co.th" },
  { code: "DEL", name: "Indira Gandhi International Airport", domain: "newdelhiairport.in" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", domain: "csmia.adaniairports.com" },
  { code: "BLR", name: "Kempegowda International Airport Bengaluru", domain: "bengaluruairport.com" },
  { code: "HYD", name: "Rajiv Gandhi International Airport", domain: "hyderabad.aero" },
  { code: "MAA", name: "Chennai International Airport", domain: "aai.aero" },
  { code: "FRA", name: "Frankfurt Airport", domain: "frankfurt-airport.com" },
  { code: "CDG", name: "Paris Charles de Gaulle Airport", domain: "parisaeroport.fr" },
];

type LogoItem = {
  code: string;
  name: string;
  domain: string;
};

const flightSearchTopics = [
  "live flight tracker",
  "flight status by flight number",
  "real-time aircraft tracking",
  "flight radar alternative",
  "airline flight status",
  "airport arrivals and departures",
  "flight delay tracker",
  "flight cancellation status",
  "estimated departure time",
  "estimated arrival time",
  "gate and terminal information",
  "aircraft registration lookup",
  "route progress map",
  "airport live status",
  "aircraft seat map checker",
  "window aisle middle seat checker",
];

const aviationGlossary = [
  ["Scheduled time", "The planned departure or arrival time published in the flight schedule."],
  ["Estimated time", "A predicted operational time that can move as airline, airport, or air traffic updates change."],
  ["Actual time", "The recorded time for a completed event such as takeoff, landing, or gate arrival when available."],
  ["Flight status", "A label such as scheduled, active, landed, delayed, cancelled, incident, or diverted."],
  ["IATA code", "A short airline or airport code used in consumer travel searches, such as DEL, JFK, EK, or AA."],
  ["ICAO code", "A four-letter airport or three-letter airline code often used in operational aviation systems."],
  ["Gate", "The passenger boarding or arrival position inside a terminal, often updated close to departure."],
  ["Terminal", "The airport building or section where check-in, security, boarding, arrivals, and baggage handling occur."],
  ["Live telemetry", "Aircraft position, altitude, speed, heading, and ground status when a reliable live feed is available."],
  ["Delay minutes", "A data-provider estimate of how far a flight is behind its scheduled or estimated operational time."],
];

export const metadata: Metadata = {
  title: "Flight Tracker Information, Live Tracking, Airlines and Airports",
  description:
    "Learn how AeroTrack live flight tracking works, what data it shows, supported airlines and airports, delay information, seat maps, and data accuracy limitations.",
  alternates: {
    canonical: "/flight-tracker-information",
  },
  keywords: [
    "how flight tracker works",
    "real time flight tracker information",
    "supported airlines flight tracker",
    "supported airports arrivals departures",
    "flight delay information",
    "aviation data accuracy",
    "flight number tracker",
    "airline tracker",
    "live airport status",
    "gate terminal status",
    "flight cancellation tracker",
    "flight delay status",
    "aircraft registration",
    "flight map",
    "arrival departure board",
    "airport live board",
    "plane tracker",
    "airplane tracker",
    "real-time aviation data",
  ],
  openGraph: {
    type: "article",
    url: `${siteUrl}/flight-tracker-information`,
    title: "AeroTrack Flight Tracker Information",
    description:
      "Detailed guide to live flight tracking, airport boards, airline coverage, seat maps, and data accuracy.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "AeroTrack flight tracker guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AeroTrack Flight Tracker Information",
    description: "Live tracking guide, supported airlines, airports, delays, and accuracy notes.",
    images: ["/twitter-image"],
  },
};

export default function FlightTrackerInformationPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "AeroTrack Live Flight Tracker",
        applicationCategory: "TravelApplication",
        operatingSystem: "Web",
        url: `${siteUrl}/flight-tracker-information`,
        description:
          "A web-based flight tracker for live flight status, airport arrivals and departures, route progress, aircraft information, and generic seat map previews.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How does AeroTrack real-time flight tracking work?",
            acceptedAnswer: {
              "@type": "Answer",
              text:
                "AeroTrack requests live aviation records, schedule data, airport timestamps, aircraft details, and when available live telemetry such as position, altitude, direction, and speed. If live telemetry is unavailable, the interface uses schedule and route context instead of pretending a live position exists.",
            },
          },
          {
            "@type": "Question",
            name: "Are flight delays always exact?",
            acceptedAnswer: {
              "@type": "Answer",
              text:
                "Delay values depend on airline, airport, and aviation data provider updates. They should be treated as high-signal travel guidance and verified with the airline or airport before critical travel decisions.",
            },
          },
        ],
      },
      breadcrumbJsonLd("Flight Tracker Information", "/flight-tracker-information"),
    ],
  };

  return (
    <main className="min-h-screen px-3 py-3 sm:px-5 sm:py-5 lg:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto flex w-full max-w-360 flex-col gap-4">
        <section className="glass-panel relative overflow-hidden rounded-[30px] p-5 sm:p-7">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent" />
          <p className="section-label">Flight tracker guide</p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold text-white sm:text-5xl">
            Live flight tracking, airport operations, aircraft details, and delay intelligence
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            AeroTrack helps travelers, aviation enthusiasts, operations teams, and family members follow a flight from
            search to arrival. The dashboard combines live flight status, airport timing, route context, aircraft
            information, and seat map tools in one fast web experience.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric icon={Radar} label="Live signals" value="Position, altitude, speed" />
            <Metric icon={Building2} label="Airport boards" value="Arrivals and departures" />
            <Metric icon={ShieldCheck} label="Travel context" value="Clear accuracy notices" />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <InfoBlock
            icon={Plane}
            title="What the flight tracker does"
            text="Search by flight number to see status, airline, origin, destination, terminals, gates, aircraft registration when available, scheduled time, estimated time, actual movement, and a map view. The interface is designed for quick travel checks and deeper route awareness."
          />
          <InfoBlock
            icon={Database}
            title="How real-time tracking works"
            text="Flight tracking is built from multiple aviation signals. Live telemetry can include latitude, longitude, altitude, heading, and speed. Schedule records provide departure and arrival timing. Airport fields add gate, terminal, runway, and delay context when those values are published."
          />
          <InfoBlock
            icon={Clock3}
            title="Flight delay information"
            text="AeroTrack highlights delay minutes from available operating data and shows status labels such as scheduled, active, landed, cancelled, incident, or diverted. Delays can change quickly because air traffic control flow, weather, turnaround time, crew availability, and airport congestion all move in real time."
          />
          <InfoBlock
            icon={Route}
            title="Seat map and aircraft context"
            text="The seat map checker provides generic aircraft-family layouts for common Airbus and Boeing types. It is useful for understanding likely window, aisle, middle, exit-zone, and cabin-section positions, but airline-specific cabin products may differ."
          />
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">Supported airlines</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Airline names and logos</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-400">
              Coverage depends on the aviation feed for each route and airport. These popular airlines are examples of
              the flight-number formats and airline records AeroTrack is built to recognize.
            </p>
          </div>
          <LogoGrid items={supportedAirlines} />
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">Supported airports</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Airport boards with arrivals and departures</h2>
            </div>
            <Link
              href="/airport-arrivals-departures"
              className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent transition hover:bg-accent/15"
            >
              Open airport board
            </Link>
          </div>
          <LogoGrid items={supportedAirports} />
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">Popular flight searches</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Flight tracking keywords and travel questions AeroTrack answers</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Travelers search for flight information in many different ways: by flight number, airline, airport code,
            arrival city, departure city, delay status, gate, terminal, aircraft type, or live map. AeroTrack organizes
            those aviation signals into readable flight status, airport board, route, delay, and seat map tools.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {flightSearchTopics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-slate-300"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">Aviation knowledge</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Flight tracker glossary for airline and airport data</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {aviationGlossary.map(([term, definition]) => (
              <article key={term} className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
                <h3 className="text-sm font-semibold text-white">{term}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{definition}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[30px] border-amber/20 bg-amber/10 p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber/15 text-amber">
              <AlertTriangle size={19} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Data accuracy disclaimer</h2>
              <p className="mt-3 text-sm leading-7 text-amber-50/85">
                AeroTrack is an informational travel tool. Flight status, live aircraft position, gate, terminal, delay,
                and airport board data can be delayed, unavailable, corrected, or changed without notice. Always confirm
                critical travel decisions with the airline, airport, official booking channel, or local airport display.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Radar; label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
      <Icon className="text-accent" size={18} />
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoBlock({ icon: Icon, title, text }: { icon: typeof Plane; title: string; text: string }) {
  return (
    <article className="glass-panel rounded-[30px] p-5 sm:p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-accent">
        <Icon size={19} />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
    </article>
  );
}

function LogoGrid({ items }: { items: LogoItem[] }) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.code} className="flex min-h-19 items-center gap-4 rounded-[22px] border border-white/10 bg-white/[0.035] p-3">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white p-2">
            <span className="absolute inset-0 flex items-center justify-center bg-accent/10 font-mono text-sm font-bold text-accent">
              {item.code}
            </span>
            <Image
              aria-hidden="true"
              alt=""
              src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`}
              width={48}
              height={48}
              className="relative z-10 h-full w-full object-contain"
              loading="lazy"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">{item.name}</p>
            <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent/80">{item.code}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function breadcrumbJsonLd(name: string, path: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AeroTrack", item: siteUrl },
      { "@type": "ListItem", position: 2, name, item: `${siteUrl}${path}` },
    ],
  };
}
