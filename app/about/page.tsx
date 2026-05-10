import type { Metadata } from "next";
import { Database, Map, Plane, Rows3, ShieldCheck } from "lucide-react";

const siteUrl = "https://aerotrackr.online";

export const metadata: Metadata = {
  title: "About AeroTrack",
  description:
    "Learn about AeroTrack, a live flight tracker with airport arrivals and departures, aircraft information, seat maps, route context, and clear aviation data disclaimers.",
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About AeroTrack",
    url: `${siteUrl}/about`,
    mainEntity: {
      "@type": "WebApplication",
      name: "AeroTrack",
      applicationCategory: "TravelApplication",
      operatingSystem: "Web",
      url: siteUrl,
    },
  };

  return (
    <main className="min-h-screen px-3 py-3 sm:px-5 sm:py-5 lg:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto flex w-full max-w-340 flex-col gap-4">
        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">About AeroTrack</p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold text-white sm:text-5xl">
            A focused flight tracker for live aviation status, airport boards, and seat map planning
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            AeroTrack is built to make flight information easier to scan. It brings together flight lookup, live-style
            airport arrivals and departures, route context, aircraft information, delay awareness, and generic seat map
            tools in a fast web interface.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <AboutCard
            icon={Plane}
            title="What AeroTrack does"
            text="AeroTrack helps users search flights, check airport boards, review flight status, understand route progress, and inspect common aircraft cabin layouts. It is designed for travelers, pickup planning, aviation enthusiasts, and anyone who wants a clean status view without hunting through multiple screens."
          />
          <AboutCard
            icon={Database}
            title="How aviation data is used"
            text="The website uses API-powered aviation data for operational fields such as flight status, airports, scheduled and estimated times, terminals, gates, aircraft identifiers, live telemetry when available, and delay information. These records are interpreted and displayed for convenience, not as official operational instructions."
          />
          <AboutCard
            icon={Map}
            title="Airport and route context"
            text="Dedicated airport pages help users find arrivals, departures, live status, and delay information for major airports. Route and airport text adds context around common travel patterns, operational pressure, and the type of data users should verify before traveling."
          />
          <AboutCard
            icon={Rows3}
            title="Aircraft and seat map tools"
            text="Seat maps are aircraft-family previews. They help explain likely window, aisle, middle, exit-row, and cabin block positions, but exact airline seat maps can differ by subfleet, cabin retrofit, route, and aircraft version."
          />
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <ShieldCheck size={19} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Our data philosophy</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Aviation data changes constantly. AeroTrack prioritizes clear labels, readable boards, useful context,
                and honest disclaimers. If live telemetry is unavailable, the site avoids pretending that schedule data
                is a guaranteed real-time aircraft position. For travel decisions, official airline and airport channels
                remain the final source.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function AboutCard({ icon: Icon, title, text }: { icon: typeof Plane; title: string; text: string }) {
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
