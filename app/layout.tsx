import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aerotrackr.online"),
  applicationName: "AeroTrack",
  title: {
    default: "AeroTrack Live Flight Tracker",
    template: "%s | AeroTrack",
  },
  description:
    "Track flights live with AeroTrack. Real-time positions, airport intelligence, aircraft details, and cabin seat maps in a clean, mobile-ready dashboard.",
  keywords: [
    "flight tracker",
    "live flight tracking",
    "flight status",
    "aircraft tracking",
    "airport arrivals",
    "airport departures",
    "flight radar",
    "seat map",
    "aviation",
    "airline status",
    "airport board",
    "flight delay tracker",
    "aircraft seat map checker",
    "airport live status",
    "airport arrivals today",
    "airport departures today",
    "flight number tracker",
    "plane tracker",
    "airplane tracker",
    "flight map",
    "gate status",
    "terminal status",
    "airline flight status",
    "aircraft registration lookup",
    "best airplane seats",
    "aircraft seating chart",
    "window seat checker",
    "aisle seat checker",
    "Boeing seat map",
    "Airbus seat map",
  ],
  alternates: {
    canonical: "https://aerotrackr.online",
  },
  authors: [{ name: "AeroTrack" }],
  creator: "AeroTrack",
  publisher: "AeroTrack",
  category: "travel",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    url: "https://aerotrackr.online",
    title: "AeroTrack Live Flight Tracker",
    description:
      "Real-time flight tracking with live positions, airport status, and aircraft details in a clean control center.",
    siteName: "AeroTrack",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AeroTrack Live Flight Tracker",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "AeroTrack",
    statusBarStyle: "black-translucent",
  },
  twitter: {
    card: "summary_large_image",
    title: "AeroTrack Live Flight Tracker",
    description:
      "Track flights live with real-time positions, status, and aircraft details.",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "AeroTrack",
      alternateName: "AeroTrackr",
      url: "https://aerotrackr.online",
      description:
        "Live flight tracking with real-time positions, airport intelligence, aircraft details, and seat maps.",
      inLanguage: "en",
      potentialAction: [
        {
          "@type": "SearchAction",
          target: "https://aerotrackr.online/?flight={flight_number}",
          "query-input": "required name=flight_number",
        },
        {
          "@type": "SearchAction",
          target: "https://aerotrackr.online/airport-arrivals-departures?airport={airport_iata}",
          "query-input": "required name=airport_iata",
        },
        {
          "@type": "SearchAction",
          target: "https://aerotrackr.online/seat-map-checker?aircraft={aircraft_type}&seat={seat_number}",
          "query-input": "required name=aircraft_type",
        },
      ],
    },
    {
      "@type": "Organization",
      name: "AeroTrack",
      url: "https://aerotrackr.online",
      logo: {
        "@type": "ImageObject",
        url: "https://aerotrackr.online/icon.svg",
      },
      sameAs: ["https://aerotrackr.online/flight-tracker-information"],
    },
    {
      "@type": "WebApplication",
      name: "AeroTrack Live Flight Tracker",
      applicationCategory: "TravelApplication",
      operatingSystem: "Web",
      url: "https://aerotrackr.online",
      description:
        "A real-time flight tracking dashboard for flight status, airport boards, aircraft details, route maps, and seat map previews.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-adsense-account" content="ca-pub-2579358094722298" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2579358094722298"
          crossOrigin="anonymous"
        />
        <Script
          id="ms-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "waheape6ay");`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background text-foreground"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
