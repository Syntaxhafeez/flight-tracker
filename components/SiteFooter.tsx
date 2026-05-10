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
    <footer className="px-3 pb-4 sm:px-5 sm:pb-5 lg:px-6">
      <div className="mx-auto w-full max-w-400">
        <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#07111f]/72 shadow-[0_20px_60px_rgba(2,12,27,0.34)] sm:rounded-[28px]">
          <div className="grid gap-4 px-4 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent sm:h-10 sm:w-10 sm:rounded-2xl">
                  <Plane size={15} />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">AeroTrack</p>
                  <p className="mt-0.5 text-xs text-slate-500 sm:mt-1">Live flight status and airport tools.</p>
                </div>
              </div>
              <p className="mt-3 max-w-2xl text-xs leading-5 text-slate-400 sm:mt-4 sm:text-sm sm:leading-6">
                AeroTrack is an independent informational aviation tool. Flight, airport, delay, aircraft, and seat map
                information can change without notice.
              </p>
            </div>

            <nav className="grid grid-cols-2 gap-3 sm:gap-5" aria-label="Footer">
              {linkGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{group.title}</p>
                  <div className="mt-2 grid gap-1 sm:mt-3 sm:gap-1.5">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-xl px-0 py-1 text-xs text-slate-300 transition hover:text-accent sm:py-1.5 sm:text-sm"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          <div className="border-t border-white/10 px-4 py-3 text-[11px] leading-5 text-slate-500 sm:px-6 sm:py-4 sm:text-xs sm:leading-6">
            <p>© {new Date().getFullYear()} AeroTrack. Verify critical travel details with official airline or airport channels.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
