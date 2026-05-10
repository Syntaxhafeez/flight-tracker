import type { Metadata } from "next";
import { Clock3, Mail, MessageSquare, ShieldCheck } from "lucide-react";

const siteUrl = "https://aerotrackr.online";
const contactEmail = "syntaxhafeez@gmail.com";

export const metadata: Metadata = {
  title: "Contact AeroTrack",
  description:
    "Contact AeroTrack for flight tracker questions, aviation data issues, privacy requests, corrections, partnerships, and technical support.",
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact AeroTrack",
    url: `${siteUrl}/contact`,
    contactPoint: {
      "@type": "ContactPoint",
      email: contactEmail,
      contactType: "customer support",
      availableLanguage: ["en"],
    },
  };

  return (
    <main className="min-h-screen px-3 py-3 sm:px-5 sm:py-5 lg:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">Contact</p>
          <h1 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">Contact AeroTrack</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            Reach out for product feedback, technical issues, aviation data concerns, privacy requests, content
            corrections, or partnership questions. Please do not send passport numbers, payment details, full booking
            documents, or sensitive personal travel records.
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent-strong"
            aria-label="Email AeroTrack support"
          >
            <Mail size={17} />
            Email AeroTrack
          </a>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <ContactCard
            icon={MessageSquare}
            title="Support and feedback"
            text="Tell us what you were searching for, what page you were using, and what you expected to happen. Screenshots and exact flight or airport codes help us diagnose issues faster."
          />
          <ContactCard
            icon={ShieldCheck}
            title="Privacy requests"
            text="Use the email button above for privacy questions, analytics concerns, correction requests, or deletion requests where applicable. We may need basic details to locate the relevant record."
          />
          <ContactCard
            icon={Clock3}
            title="Data corrections"
            text="AeroTrack uses third-party aviation data, so some corrections must originate with airlines, airports, or data providers. We still welcome reports about stale, confusing, or mismatched displays."
          />
        </section>

        <section className="glass-panel rounded-[30px] p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-white">Before you email</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "For a flight issue, include the flight number and date.",
              "For airport boards, include the airport IATA code and arrivals or departures mode.",
              "For seat maps, include the aircraft type and seat number.",
              "For privacy questions, avoid sharing sensitive travel documents.",
            ].map((item) => (
              <div key={item} className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function ContactCard({ icon: Icon, title, text }: { icon: typeof Mail; title: string; text: string }) {
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
