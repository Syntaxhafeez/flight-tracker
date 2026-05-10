import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Database, Eye, Mail, ShieldCheck } from "lucide-react";

const siteUrl = "https://aerotrackr.online";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the AeroTrack privacy policy, including what information may be collected, how aviation API data is used, analytics, cookies, and contact details.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    name: "AeroTrack Privacy Policy",
    url: `${siteUrl}/privacy-policy`,
    publisher: { "@type": "Organization", name: "AeroTrack", url: siteUrl },
  };

  return (
    <LegalPage
      label="Privacy Policy"
      title="Privacy Policy"
      description="This policy explains how AeroTrack handles information when you use our flight tracker, airport board, aircraft information, and seat map tools."
      jsonLd={jsonLd}
      cards={[
        ["Effective date", "May 10, 2026"],
        ["Contact", "syntaxhafeez@gmail.com"],
        ["Service type", "Informational aviation tracking website"],
      ]}
    >
      <Section icon={Eye} title="Information we collect">
        AeroTrack is designed to work without requiring account registration. When you search for a flight number,
        airport code, aircraft type, or seat number, that query may be processed by our application so we can return
        the requested aviation information. Standard technical information such as IP address, browser type, device
        information, pages visited, referring pages, timestamps, and diagnostic logs may be processed by hosting,
        analytics, security, and performance systems.
      </Section>

      <Section icon={Database} title="Aviation API and third-party data">
        AeroTrack uses aviation data providers and APIs to show flight status, airport arrivals and departures, aircraft
        details, route context, delay information, and related operational fields. We do not control airline, airport, or
        aviation data provider systems. Flight and airport data can be delayed, incomplete, corrected, unavailable, or
        changed without notice.
      </Section>

      <Section icon={ShieldCheck} title="Analytics, cookies, and service improvement">
        We may use analytics and performance tools, including Microsoft Clarity, to understand usage patterns, improve
        reliability, identify errors, and make the website easier to use. These tools may use cookies or similar
        technologies. You can control cookies through your browser settings, although some functionality may be affected.
      </Section>

      <Section icon={Mail} title="How to contact us">
        For privacy questions, correction requests, deletion requests where applicable, or data-related concerns, contact
        us at <a className="text-accent underline-offset-4 hover:underline" href="mailto:syntaxhafeez@gmail.com">syntaxhafeez@gmail.com</a>.
        Please include enough detail for us to understand your request. Do not send sensitive travel documents, passport
        numbers, payment information, or confidential booking details.
      </Section>

      <Section title="How we use information">
        We use information to provide search results, operate the website, maintain security, debug issues, measure
        performance, understand aggregate usage, improve pages and tools, prevent abuse, and comply with applicable legal
        obligations. We do not sell personal information as part of AeroTrack.
      </Section>

      <Section title="Children, security, and retention">
        AeroTrack is not directed to children. We keep technical records only as long as needed for legitimate operational,
        security, analytics, or legal purposes. No internet service can be guaranteed perfectly secure, but we use
        reasonable technical and organizational safeguards appropriate for an informational website.
      </Section>
    </LegalPage>
  );
}

function LegalPage({
  label,
  title,
  description,
  cards,
  jsonLd,
  children,
}: {
  label: string;
  title: string;
  description: string;
  cards: string[][];
  jsonLd: object;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen px-3 py-3 sm:px-5 sm:py-5 lg:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">{label}</p>
          <h1 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">{description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {cards.map(([cardLabel, value]) => (
              <div key={cardLabel} className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{cardLabel}</p>
                <p className="mt-2 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-4">{children}</section>
      </div>
    </main>
  );
}

function Section({ icon: Icon, title, children }: { icon?: typeof ShieldCheck; title: string; children: ReactNode }) {
  return (
    <article className="glass-panel rounded-[30px] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        {Icon ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-accent">
            <Icon size={19} />
          </div>
        ) : null}
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">{children}</p>
        </div>
      </div>
    </article>
  );
}
