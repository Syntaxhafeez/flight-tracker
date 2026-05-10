import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Armchair, CheckCircle2, Rows3, ShieldCheck } from "lucide-react";

import SeatMapPanel from "@/components/SeatMapPanel";
import { aircraftSeoProfiles } from "@/utils/aircraftSeo";

const siteUrl = "https://aerotrackr.online";

const aircraftTypes = [
  { code: "A320", maker: "Airbus", name: "Airbus A320 family", text: "Typical 3-3 narrow-body layout used on short and medium haul routes." },
  { code: "A321", maker: "Airbus", name: "Airbus A321 family", text: "Longer narrow-body cabin with more rows and similar seat lettering." },
  { code: "B737", maker: "Boeing", name: "Boeing 737 family", text: "Common 3-3 single-aisle layout across domestic and regional networks." },
  { code: "B777", maker: "Boeing", name: "Boeing 777 family", text: "Wide-body cabin with left, center, and right seat blocks." },
  { code: "B787", maker: "Boeing", name: "Boeing 787 Dreamliner", text: "Wide-body cabin with long-haul seat blocks and large windows." },
  { code: "A350", maker: "Airbus", name: "Airbus A350 family", text: "Modern wide-body cabin often used on long international routes." },
  { code: "A380", maker: "Airbus", name: "Airbus A380 main deck", text: "Large double-deck aircraft previewed with a main-deck economy layout." },
];

const seatMapSearchTopics = [
  "aircraft seat map",
  "airplane seating layout",
  "flight seat checker",
  "window seat finder",
  "aisle seat finder",
  "middle seat checker",
  "exit row seat map",
  "bulkhead seat information",
  "Airbus A320 seat map",
  "Boeing 737 seating layout",
  "Boeing 777 seat map",
  "Boeing 787 Dreamliner seats",
  "Airbus A350 seat map",
  "Airbus A380 seating layout",
  "best seats on plane",
  "economy cabin layout",
  "wide-body seat map",
  "narrow-body seat map",
];

const cabinKnowledge = [
  ["Window seats", "Usually the outermost letters in each row, useful for views, leaning against the cabin wall, and minimizing disturbance."],
  ["Aisle seats", "Seats beside the aisle, useful for passengers who want easier movement, quicker exit, or less climbing over others."],
  ["Middle seats", "Seats between two passengers or between a window and aisle; usually less preferred on economy layouts."],
  ["Exit rows", "Rows near emergency exits that may offer extra legroom but can include safety requirements, fixed armrests, or storage rules."],
  ["Bulkhead rows", "First rows behind a cabin wall or divider; they may have extra knee space but different screen and tray-table positions."],
  ["Galley areas", "Food-preparation areas that can bring more light, crew activity, noise, and foot traffic on long flights."],
  ["Lavatory-adjacent rows", "Convenient for access but sometimes busier because passengers queue nearby."],
  ["Seat pitch", "The distance between one point on a seat and the same point on the seat in front, often used as a legroom indicator."],
];

export const metadata: Metadata = {
  title: "Seat Map Checker for Airbus and Boeing Aircraft",
  description:
    "Use AeroTrack's seat map checker to preview generic aircraft seating for A320, A321, B737, B777, B787, A350, and A380 cabins and identify window, aisle, and middle seats.",
  alternates: {
    canonical: "/seat-map-checker",
  },
  keywords: [
    "seat map checker",
    "aircraft seat map",
    "flight seat checker",
    "A320 seat map",
    "B737 seat map",
    "B777 seat map",
    "B787 seat map",
    "A350 seat map",
    "A380 seat map",
    "airplane seating chart",
    "flight seat map",
    "best plane seats",
    "window seat checker",
    "aisle seat checker",
    "exit row seats",
    "bulkhead seats",
    "economy seat layout",
    "aircraft cabin map",
  ],
  openGraph: {
    type: "website",
    url: `${siteUrl}/seat-map-checker`,
    title: "AeroTrack Seat Map Checker",
    description:
      "Preview aircraft-family seating and check whether a seat is likely to be window, aisle, or middle.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "AeroTrack seat map checker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AeroTrack Seat Map Checker",
    description: "Check generic Airbus and Boeing seat maps before you fly.",
    images: ["/twitter-image"],
  },
};

export default async function SeatMapCheckerPage({
  searchParams,
}: {
  searchParams: Promise<{ aircraft?: string; seat?: string }>;
}) {
  const params = await searchParams;
  const aircraft = typeof params.aircraft === "string" ? params.aircraft.toUpperCase() : "";
  const seat = typeof params.seat === "string" ? params.seat.toUpperCase() : "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "AeroTrack Seat Map Checker",
        applicationCategory: "TravelApplication",
        operatingSystem: "Web",
        url: `${siteUrl}/seat-map-checker`,
        description:
          "A seat map checker for generic Airbus and Boeing aircraft family layouts, including window, aisle, and middle seat identification.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is the AeroTrack seat map airline specific?",
            acceptedAnswer: {
              "@type": "Answer",
              text:
                "The checker uses generic aircraft-family layouts. Airlines can install different cabins, rows, seat numbering, business class products, premium economy sections, and extra-legroom zones.",
            },
          },
          {
            "@type": "Question",
            name: "Which aircraft seat maps are supported?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "AeroTrack currently supports generic A320, A321, B737, B777, B787, A350, and A380 layouts.",
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
      <div className="mx-auto flex w-full max-w-360 flex-col gap-4">
        <section className="glass-panel relative overflow-hidden rounded-[30px] p-5 sm:p-7">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent" />
          <p className="section-label">Seat map checker</p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold text-white sm:text-5xl">
            Check aircraft seat maps before choosing your seat
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            Enter an aircraft type and optional seat number to preview a generic cabin layout. AeroTrack highlights
            whether the seat is likely to be a window, aisle, or middle seat and gives quick context for common Airbus
            and Boeing aircraft families.
          </p>
        </section>

        <SeatMapPanel
          aircraftDisplayName={aircraft}
          initialSeatNumber={seat}
          defaultOpen
        />

        <section className="grid gap-4 lg:grid-cols-3">
          <Feature icon={Armchair} title="Seat position" text="Understand likely window, aisle, and middle positions from the seat letter and cabin block." />
          <Feature icon={Rows3} title="Cabin family" text="Compare common narrow-body, wide-body, and double-deck aircraft family layouts." />
          <Feature icon={ShieldCheck} title="Clear limits" text="Use the map as planning guidance and confirm exact layouts with the operating airline." />
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">Supported aircraft</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Aircraft types and seating details</h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {aircraftTypes.map((aircraft) => (
              <article key={aircraft.code} className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-start gap-3">
                  <div className="relative flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white p-2">
                    <span className="absolute inset-0 flex items-center justify-center bg-accent/10 font-mono text-sm font-bold text-accent">
                      {aircraft.code}
                    </span>
                    <Image
                      aria-hidden="true"
                      alt=""
                      src={`https://www.google.com/s2/favicons?domain=${aircraft.maker === "Airbus" ? "airbus.com" : "boeing.com"}&sz=128`}
                      width={44}
                      height={44}
                      className="relative z-10 h-full w-full object-contain"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{aircraft.name}</h3>
                    <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent/80">{aircraft.code}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{aircraft.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">Dedicated aircraft pages</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Popular aircraft seat maps</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {aircraftSeoProfiles.map((aircraft) => (
              <Link
                key={aircraft.code}
                href={`/aircraft/${aircraft.slug}`}
                className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4 transition hover:border-accent/35 hover:bg-accent/10"
              >
                <span className="font-mono text-sm font-bold text-accent">{aircraft.code}</span>
                <p className="mt-2 text-sm font-semibold text-white">{aircraft.name}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">Seat map guide</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">Seat map search coverage</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Aircraft seat map, seating chart, and best seat searches</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            AeroTrack supports common seat-selection searches for aircraft cabin maps, airplane seating charts, economy
            layouts, window seats, aisle seats, middle seats, exit rows, bulkhead rows, wide-body cabins, and
            narrow-body aircraft families.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {seatMapSearchTopics.map((topic) => (
              <span key={topic} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-slate-300">
                {topic}
              </span>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">Cabin knowledge</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Seat map terms travelers should know</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {cabinKnowledge.map(([term, text]) => (
              <article key={term} className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
                <h3 className="text-sm font-semibold text-white">{term}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">How to use it</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["Enter aircraft type such as A320 or B787.", "Add a seat number such as 12A or 24C.", "Review the highlighted seat position and cabin row."].map((item, index) => (
              <div key={item} className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
                <CheckCircle2 className="text-accent" size={18} />
                <p className="mt-3 text-sm leading-6 text-slate-300">{index + 1}. {item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({ icon: Icon, title, text }: { icon: typeof Armchair; title: string; text: string }) {
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
