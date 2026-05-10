"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export default function LogoIcon({
  code,
  domain,
  label,
  size = 44,
}: {
  code: string;
  domain: string;
  label: string;
  size?: number;
}) {
  const sources = useMemo(
    () => [
      `https://logo.clearbit.com/${domain}`,
      `https://www.google.com/s2/favicons?domain_url=https://${domain}&sz=128`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    ],
    [domain],
  );
  const [sourceIndex, setSourceIndex] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white p-2">
      <span className="absolute inset-0 flex items-center justify-center bg-accent/10 font-mono text-sm font-bold text-accent">
        {code}
      </span>
      {!showFallback ? (
        <Image
          aria-hidden="true"
          alt=""
          src={sources[sourceIndex]}
          width={size}
          height={size}
          className="relative z-10 h-full w-full object-contain"
          unoptimized
          onError={() => {
            if (sourceIndex < sources.length - 1) {
              setSourceIndex((current) => current + 1);
            } else {
              setShowFallback(true);
            }
          }}
        />
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
}
