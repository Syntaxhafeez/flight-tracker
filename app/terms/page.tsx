import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AlertTriangle, Database, FileText, ShieldCheck } from "lucide-react";

const siteUrl = "https://aerotrackr.online";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Read AeroTrack terms of use for flight tracking, airport boards, aircraft information, seat maps, API-powered aviation data, disclaimers, and acceptable use.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AeroTrack Terms of Use",
    url: `${siteUrl}/terms`,
    about: "Terms for using AeroTrack flight tracking and aviation information tools.",
  };

  return (
    <main className="min-h-screen px-3 py-3 sm:px-5 sm:py-5 lg:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <section className="glass-panel rounded-[30px] p-5 sm:p-7">
          <p className="section-label">Terms</p>
          <h1 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">Terms of Use</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            These terms govern your use of AeroTrack, including flight tracking, airport arrivals and departures,
            aircraft information pages, and seat map tools. By using the site, you agree to use it responsibly and only
            for lawful informational purposes.
          </p>
          <p className="mt-4 text-sm text-slate-500">Effective date: May 10, 2026</p>
        </section>

        <Term icon={Database} title="Aviation data and API-powered content">
          AeroTrack displays information from aviation APIs, public aviation references, and application-generated
          interpretation such as generic seat maps and route context. Flight status, live positions, terminal, gate,
          aircraft, delay, runway, and airport board fields may be delayed, incomplete, inaccurate, unavailable, or
          changed by airlines, airports, air traffic control, or data providers.
        </Term>

        <Term icon={AlertTriangle} title="No travel, safety, legal, or operational guarantee">
          AeroTrack is not an airline, airport, travel agency, air navigation service, safety system, or official source
          of operational instructions. Do not rely on AeroTrack as the only source for boarding, check-in, visa,
          connection, safety, emergency, or time-critical travel decisions. Always confirm important details with your
          airline, airport, official booking channel, or relevant authority.
        </Term>

        <Term icon={FileText} title="Acceptable use">
          You may use AeroTrack for personal travel planning, general aviation awareness, and informational research. You
          may not misuse the site, overload APIs, scrape at abusive volume, attempt unauthorized access, interfere with
          service availability, copy content in a way that violates applicable law, or present AeroTrack data as official
          airline or airport data.
        </Term>

        <Term icon={ShieldCheck} title="Liability and changes">
          AeroTrack is provided on an “as available” basis. To the maximum extent permitted by law, we disclaim liability
          for losses caused by unavailable data, changed flight information, missed flights, travel disruption, reliance
          on generic seat maps, third-party links, or technical errors. We may update these terms, pages, features, or
          data sources from time to time.
        </Term>

        <section className="glass-panel rounded-[30px] p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-white">Questions</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            For questions about these terms, contact{" "}
            <a className="text-accent underline-offset-4 hover:underline" href="mailto:syntaxhafeez@gmail.com">
              syntaxhafeez@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </main>
  );
}

function Term({ icon: Icon, title, children }: { icon: typeof ShieldCheck; title: string; children: ReactNode }) {
  return (
    <article className="glass-panel rounded-[30px] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-accent">
          <Icon size={19} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">{children}</p>
        </div>
      </div>
    </article>
  );
}
