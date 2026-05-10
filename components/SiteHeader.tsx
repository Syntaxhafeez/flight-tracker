"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Plane } from "lucide-react";

import { cn } from "@/utils/cn";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/flight-tracker-information", label: "Tracker Guide" },
  { href: "/airport-arrivals-departures", label: "Airports" },
  { href: "/seat-map-checker", label: "Seat Maps" },
  { href: "/faq", label: "FAQ" },
];

const secondaryLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="px-3 pt-3 sm:px-5 sm:pt-5 lg:px-6">
      <div className="mx-auto w-full max-w-400">
        <nav
          aria-label="Primary"
          className="flex flex-col gap-3 rounded-[26px] border border-white/10 bg-[#07111f]/82 px-4 py-3 shadow-[0_18px_54px_rgba(2,12,27,0.34)] backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between"
        >
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Plane size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-semibold text-white">AeroTrack</span>
              <span className="block truncate text-xs text-slate-500">Live aviation intelligence</span>
            </span>
          </Link>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
            <div className="flex flex-wrap gap-1 rounded-[18px] border border-white/8 bg-white/[0.025] p-1">
              {primaryLinks.map((link) => (
                <HeaderLink key={link.href} href={link.href} active={isActive(pathname, link.href)}>
                  {link.label}
                </HeaderLink>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {secondaryLinks.map((link) => (
                <HeaderLink key={link.href} href={link.href} active={isActive(pathname, link.href)} subtle>
                  {link.label}
                </HeaderLink>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

function HeaderLink({
  href,
  active,
  subtle = false,
  children,
}: {
  href: string;
  active: boolean;
  subtle?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-[14px] px-3 text-[11px] font-semibold uppercase tracking-[0.12em] transition sm:text-xs",
        active
          ? "bg-accent text-accent-foreground shadow-[0_10px_24px_rgba(94,234,212,0.16)]"
          : subtle
            ? "border border-white/8 bg-white/[0.025] text-slate-300 hover:border-accent/25 hover:text-white"
            : "text-slate-300 hover:bg-white/[0.06] hover:text-white",
      )}
    >
      {children}
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
