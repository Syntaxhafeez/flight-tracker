import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Clock3, Database, HelpCircle, Plane, Rows3, Search, ShieldCheck } from "lucide-react";

const faqs = [
  {
    question: "What does AeroTrack do?",
    answer:
      "AeroTrack provides flight lookup, airport arrivals and departures boards, aircraft information pages, route context, delay awareness, and generic aircraft seat map tools for general travel planning and aviation research.",
  },
  {
    question: "Is AeroTrack an official airline or airport website?",
    answer:
      "No. AeroTrack is an independent informational website. It is not an airline, airport, travel agency, air traffic control service, or official aviation authority. Always confirm critical travel details with the airline or airport.",
  },
  {
    question: "How does live flight tracking work?",
    answer:
      "AeroTrack displays API-powered aviation records such as flight status, schedules, estimated times, airport fields, aircraft information, and live telemetry when available. If live position data is unavailable, the site may show schedule or route context instead.",
  },
  {
    question: "Why can flight status or airport board data be delayed?",
    answer:
      "Flight and airport data can change because of airline updates, airport operations, weather, air traffic control, aircraft rotation, ground handling, crew availability, and data provider refresh timing.",
  },
  {
    question: "Can I rely on AeroTrack for boarding, check-in, or connection decisions?",
    answer:
      "Use AeroTrack as a planning and awareness tool, not as the only source for time-critical travel decisions. Boarding, check-in, gate, terminal, baggage, visa, and connection decisions should be confirmed through official airline or airport channels.",
  },
  {
    question: "What does the airport arrivals and departures board show?",
    answer:
      "Airport boards can show flight number, airline, time, origin or destination, terminal, gate, status, delay minutes, and aircraft identifier when those fields are available from the aviation data provider.",
  },
  {
    question: "Which airport pages are available?",
    answer:
      "AeroTrack includes dedicated airport pages for major airports such as Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Dubai, Singapore, Bangkok, London Heathrow, and New York JFK, with live board access and airport-specific context.",
  },
  {
    question: "Are aircraft seat maps airline specific?",
    answer:
      "No. AeroTrack seat maps are aircraft-family previews. Exact airline cabins can differ by subfleet, aircraft version, cabin retrofit, premium cabin, row numbering, seat pitch, exit rows, lavatories, and galley placement.",
  },
  {
    question: "How do I highlight a seat on the seat map?",
    answer:
      "Open a seat map page, enter an aircraft type such as A320 or B777, then enter a seat number such as 12A. The tool highlights the matching generic seat position when it fits the supported layout.",
  },
  {
    question: "What aircraft seat map pages are supported?",
    answer:
      "AeroTrack includes dedicated aircraft pages for Airbus A320, Boeing 737, Boeing 777, Boeing 787 Dreamliner, and Airbus A350, with seat map tools and cabin guidance.",
  },
  {
    question: "Why does a gate, terminal, aircraft, or delay field sometimes show unavailable?",
    answer:
      "Some airlines and airports do not publish every field, or they publish it only near departure or arrival. Data can also be missing when the provider has not received a reliable update.",
  },
  {
    question: "Does AeroTrack store my booking or passport information?",
    answer:
      "AeroTrack does not ask for booking references, passport numbers, payment details, or travel documents. Do not send sensitive travel records through the website or contact email.",
  },
];

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers about AeroTrack flight tracking, airport arrivals and departures, live flight status, delay data, aircraft pages, seat maps, privacy, and API-powered aviation information.",
  alternates: { canonical: "/faq" },
  keywords: [
    "flight tracker FAQ",
    "airport arrivals FAQ",
    "airport departures FAQ",
    "flight status questions",
    "seat map FAQ",
    "aviation data accuracy",
  ],
  robots: { index: true, follow: true },
};

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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
          <p className="section-label">FAQ</p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold text-white sm:text-5xl">
            Flight tracking, airport boards, aircraft, and seat map FAQs
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            Answers to common questions about AeroTrack, API-powered aviation data, live flight status, airport arrivals
            and departures, delay information, aircraft pages, privacy, and generic seat maps.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <QuickCard icon={Plane} label="Flights" value="Status and route context" />
            <QuickCard icon={Clock3} label="Airports" value="Arrivals and departures" />
            <QuickCard icon={Rows3} label="Seat maps" value="Generic cabin previews" />
            <QuickCard icon={ShieldCheck} label="Accuracy" value="Clear limitations" />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="glass-panel h-fit rounded-[30px] p-5 sm:p-6">
            <HelpCircle className="text-accent" size={22} />
            <h2 className="mt-4 text-xl font-semibold text-white">Important note</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              AeroTrack is an informational website. Aviation API data can be delayed, incomplete, corrected, or
              unavailable. Use official airline and airport channels for boarding, check-in, visa, baggage, disruption,
              and safety decisions.
            </p>
            <div className="mt-5 grid gap-2">
              <Link href="/privacy-policy" className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-slate-300 transition hover:border-accent/30 hover:bg-accent/10 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-slate-300 transition hover:border-accent/30 hover:bg-accent/10 hover:text-white">
                Terms of Use
              </Link>
              <Link href="/contact" className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-slate-300 transition hover:border-accent/30 hover:bg-accent/10 hover:text-white">
                Contact AeroTrack
              </Link>
            </div>
          </aside>

          <section className="grid gap-3">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                open={index < 4}
                className="glass-panel group rounded-3xl p-4 transition hover:border-accent/25"
              >
                <summary className="flex list-none items-start justify-between gap-4 text-left">
                  <span className="text-base font-semibold text-white">{faq.question}</span>
                  <span className="mt-1 shrink-0 rounded-full border border-white/10 px-2 py-0.5 font-mono text-xs text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </section>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <InfoBlock
            icon={Database}
            title="About aviation data"
            text="AeroTrack uses API-powered aviation records and presents them in a traveler-friendly format. Some fields depend on airline and airport publishing behavior, so missing or changing data is normal."
          />
          <InfoBlock
            icon={Search}
            title="Where to search"
            text="Use the home flight search for flight numbers, airport pages for arrivals and departures, and aircraft pages for seat map intent such as Airbus A320 seat map or Boeing 777 seating layout."
          />
          <InfoBlock
            icon={AlertTriangle}
            title="When to verify"
            text="Verify official information before leaving for the airport, checking bags, making tight connections, changing bookings, or relying on any gate, terminal, or delay estimate."
          />
        </section>
      </div>
    </main>
  );
}

function QuickCard({ icon: Icon, label, value }: { icon: typeof Plane; label: string; value: string }) {
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
    <article className="glass-panel rounded-[30px] p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-accent">
        <Icon size={19} />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
    </article>
  );
}
