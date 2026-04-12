import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
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
  "@type": "WebSite",
  name: "AeroTrack",
  url: "https://aerotrackr.online",
  description:
    "Live flight tracking with real-time positions, airport intelligence, aircraft details, and seat maps.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://aerotrackr.online/?flight={flight_number}",
    "query-input": "required name=flight_number",
  },
  publisher: {
    "@type": "Organization",
    name: "AeroTrack",
    url: "https://aerotrackr.online",
    logo: {
      "@type": "ImageObject",
      url: "https://aerotrackr.online/icon.svg",
    },
  },
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
        {children}
      </body>
    </html>
  );
}
