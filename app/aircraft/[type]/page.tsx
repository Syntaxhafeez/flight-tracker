import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Armchair, CheckCircle2, LayoutPanelTop, Plane, Rows3, Sparkles } from "lucide-react";

import SeatMapPanel from "@/components/SeatMapPanel";
import { aircraftSeoProfiles, getAircraftSeoProfile } from "@/utils/aircraftSeo";

const siteUrl = "https://aerotrackr.online";

type AircraftPageProps = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ seat?: string }>;
};

export function generateStaticParams() {
  return aircraftSeoProfiles.map((aircraft) => ({ type: aircraft.slug }));
}

export async function generateMetadata({ params }: AircraftPageProps): Promise<Metadata> {
  const { type } = await params;
  const aircraft = getAircraftSeoProfile(type);

  if (!aircraft) {
    return {
      title: "Aircraft seat map",
    };
  }

  const title = `${aircraft.name} Seat Map, Seating Layout and Best Seats`;
  const description = `Check the ${aircraft.name} seat map with an interactive seat highlighter, typical ${aircraft.code} seating layout, best seats, cabin details, facts, and travel tips.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/aircraft/${aircraft.slug}`,
    },
    keywords: [
      `${aircraft.name} seat map`,
      `${aircraft.code} seat map`,
      `${aircraft.name} seating layout`,
      `${aircraft.code} best seats`,
      `${aircraft.family} economy seats`,
      `${aircraft.name} window aisle seats`,
    ],
    openGraph: {
      type: "website",
      url: `${siteUrl}/aircraft/${aircraft.slug}`,
      title,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${aircraft.name} seat map` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/twitter-image"],
    },
  };
}

export default async function AircraftSeatMapPage({ params, searchParams }: AircraftPageProps) {
  const [{ type }, query] = await Promise.all([params, searchParams]);
  const aircraft = getAircraftSeoProfile(type);

  if (!aircraft) notFound();

  const seat = typeof query.seat === "string" ? query.seat.toUpperCase() : "";
  const pageUrl = `${siteUrl}/aircraft/${aircraft.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: `${aircraft.name} Seat Map Checker`,
        applicationCategory: "TravelApplication",
        operatingSystem: "Web",
        url: pageUrl,
        description: `Interactive ${aircraft.name} seat map and seating layout with seat position highlighting.`,
      },
      {
        "@type": "TechArticle",
        headline: `${aircraft.name} seat map and seating layout`,
        description: `${aircraft.name} cabin guide with generic seat map, best seats, avoid-seat guidance, aircraft facts, and passenger tips.`,
        about: aircraft.name,
        mainEntityOfPage: pageUrl,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is the typical ${aircraft.name} seating layout?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: aircraft.typicalLayout,
            },
          },
          {
            "@type": "Question",
            name: `What are the best seats on the ${aircraft.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: aircraft.bestSeats.join("; "),
            },
          },
          {
            "@type": "Question",
            name: `Is this ${aircraft.code} seat map airline specific?`,
            acceptedAnswer: {
              "@type": "Answer",
              text:
                "This page uses a generic aircraft-family seat map. Exact airline cabins may differ by route, aircraft subfleet, premium cabin, row numbering, pitch, galley placement, lavatory placement, and extra-legroom zones.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "AeroTrack", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Seat Map Checker", item: `${siteUrl}/seat-map-checker` },
          { "@type": "ListItem", position: 3, name: aircraft.name, item: pageUrl },
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
      <div className="mx-auto flex w-full max-w-380 flex-col gap-4">
        <section className="glass-panel relative overflow-hidden rounded-[30px] p-5 sm:p-7">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent" />
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 font-mono text-sm font-bold text-accent">
              {aircraft.code}
            </span>
            <div>
              <p className="section-label">{aircraft.manufacturer} aircraft seat map</p>
              <p className="mt-1 text-sm text-slate-400">{aircraft.family} · {aircraft.cabinType}</p>
            </div>
          </div>
          <h1 className="mt-5 max-w-5xl text-3xl font-semibold text-white sm:text-5xl">
            {aircraft.name} seat map, seating layout, and best seats
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            Check a generic {aircraft.name} seat map, enter a seat number, and highlight its likely position in the
            cabin. Use this guide for {aircraft.code} window seats, aisle seats, middle seats, exit rows, and long-flight
            comfort planning before choosing your airline seat.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <HeroSignal icon={Rows3} label="Layout" value={aircraft.typicalLayout} />
            <HeroSignal icon={Armchair} label="Seat checker" value="Highlight any seat" />
            <HeroSignal icon={Plane} label="Aircraft" value={aircraft.family} />
          </div>
        </section>

        <SeatMapPanel aircraftDisplayName={aircraft.code} initialSeatNumber={seat} defaultOpen />

        <section className="grid gap-4 lg:grid-cols-3">
          <InfoCard
            icon={LayoutPanelTop}
            title={`${aircraft.code} seating layout`}
            text={aircraft.cabinDetails}
          />
          <InfoCard
            icon={CheckCircle2}
            title={`Best seats on ${aircraft.code}`}
            text={aircraft.seatAdvice}
          />
          <InfoCard
            icon={Sparkles}
            title={`${aircraft.name} facts`}
            text={aircraft.overview}
          />
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">Seat choice guide</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Best seats, seats to avoid, and passenger tips</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <SeatAdviceList title="Usually better picks" items={aircraft.bestSeats} />
            <SeatAdviceList title="Check before choosing" items={aircraft.avoidSeats} />
          </div>
          <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            <h3 className="font-semibold text-white">Where this aircraft usually flies</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{aircraft.routeUse}</p>
          </div>
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">Aircraft details</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Interesting details about the {aircraft.name}</h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {aircraft.facts.map((fact) => (
              <article key={fact} className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
                <Plane className="text-accent" size={18} />
                <p className="mt-3 text-sm leading-6 text-slate-300">{fact}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">Search phrases this page answers</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{aircraft.name} seat map and seating layout searches</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {aircraft.searchPhrases.map((phrase) => (
              <div key={phrase} className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
                <Armchair className="text-accent" size={17} />
                <p className="mt-3 text-sm font-semibold text-white">{phrase}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">Interactive cabin and seat guide</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">More aircraft pages</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Popular aircraft seat maps</h2>
            </div>
            <Link
              href="/seat-map-checker"
              className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent transition hover:bg-accent/15"
            >
              Open seat checker
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {aircraftSeoProfiles
              .filter((item) => item.code !== aircraft.code)
              .map((item) => (
                <Link
                  key={item.code}
                  href={`/aircraft/${item.slug}`}
                  className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4 transition hover:border-accent/35 hover:bg-accent/10"
                >
                  <span className="font-mono text-sm font-bold text-accent">{item.code}</span>
                  <p className="mt-2 text-sm font-semibold text-white">{item.name}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">Seat map</p>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function HeroSignal({ icon: Icon, label, value }: { icon: typeof Plane; label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
      <Icon className="text-accent" size={18} />
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-white">{value}</p>
    </div>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: typeof Plane; title: string; text: string }) {
  return (
    <article className="glass-panel rounded-[30px] p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-accent">
        <Icon size={19} />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
    </article>
  );
}

function SeatAdviceList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      <h3 className="font-semibold text-white">{title}</h3>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
            <CheckCircle2 className="mt-0.5 shrink-0 text-accent" size={16} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
