"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { Menu, Plane, X } from "lucide-react";

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

const allLinks = [...primaryLinks, ...secondaryLinks];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 px-0 pt-0 lg:px-6 lg:pt-5">
      <div className="mx-auto w-full max-w-400">
        <nav
          aria-label="Primary"
          className="flex min-h-16 items-center justify-between gap-3 border-b border-white/10 bg-[#07111f]/96 px-4 py-3 shadow-[0_12px_34px_rgba(2,12,27,0.38)] backdrop-blur-2xl lg:rounded-[26px] lg:border lg:px-4"
        >
          <Brand onClick={closeMenu} />

          <div className="hidden items-center gap-2 lg:flex">
            <div className="flex gap-1 rounded-[18px] border border-white/8 bg-white/[0.025] p-1">
              {primaryLinks.map((link) => (
                <HeaderLink key={link.href} href={link.href} active={isActive(pathname, link.href)}>
                  {link.label}
                </HeaderLink>
              ))}
            </div>
            <div className="flex gap-1">
              {secondaryLinks.slice(0, 2).map((link) => (
                <HeaderLink key={link.href} href={link.href} active={isActive(pathname, link.href)} subtle>
                  {link.label}
                </HeaderLink>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition hover:border-accent/30 hover:bg-accent/10 lg:hidden"
          >
            {isOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </nav>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition lg:hidden",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeMenu}
      />

      <aside
        className={cn(
          "fixed bottom-0 right-0 top-0 z-50 flex w-[min(22rem,calc(100vw-1rem))] flex-col border-l border-white/10 bg-[#07111f] p-4 shadow-[-24px_0_70px_rgba(2,12,27,0.55)] transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between gap-3">
          <Brand onClick={closeMenu} />
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-2">
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={cn(
                "flex min-h-12 items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                isActive(pathname, link.href)
                  ? "border-accent/40 bg-accent/15 text-accent"
                  : "border-white/10 bg-white/[0.035] text-slate-200 hover:border-accent/25 hover:bg-accent/10",
              )}
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <p className="mt-auto pt-6 text-xs leading-6 text-slate-500">
          Live flight status, airport boards, aircraft pages, and seat map tools. Verify critical travel details with
          official airline or airport channels.
        </p>
      </aside>
    </header>
  );
}

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex min-w-0 items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Plane size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-base font-semibold text-white">AeroTrack</span>
        <span className="block max-w-42 truncate text-xs text-slate-500 sm:max-w-none">Live aviation intelligence</span>
      </span>
    </Link>
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
        "inline-flex h-9 items-center justify-center rounded-[14px] px-3 text-xs font-semibold uppercase tracking-[0.12em] transition",
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
