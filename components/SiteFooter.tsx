import Link from "next/link";
import { Plane } from "lucide-react";

const linkGroups = [
  {
    title: "Tools",
    links: [
      { href: "/airport-arrivals-departures", label: "Airport boards" },
      { href: "/seat-map-checker", label: "Seat maps" },
      { href: "/flight-tracker-information", label: "Tracker guide" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy-policy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="px-3 pb-5 sm:px-5 lg:px-6">
      <div className="mx-auto w-full max-w-400">
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#07111f]/72 shadow-[0_20px_60px_rgba(2,12,27,0.34)]">
          <div className="grid gap-6 px-5 py-6 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Plane size={17} />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">AeroTrack</p>
                  <p className="mt-1 text-xs text-slate-500">Live flight status, airport boards, and seat map tools.</p>
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
                AeroTrack is an independent informational aviation tool. Flight, airport, delay, aircraft, and seat map
                information can change without notice.
              </p>
            </div>

            <nav className="grid gap-5 sm:grid-cols-2" aria-label="Footer">
              {linkGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{group.title}</p>
                  <div className="mt-3 grid gap-2">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm text-slate-300 transition hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          <div className="border-t border-white/10 px-5 py-4 text-xs leading-6 text-slate-500 sm:px-6">
            <p>© {new Date().getFullYear()} AeroTrack. Verify critical travel details with official airline or airport channels.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
