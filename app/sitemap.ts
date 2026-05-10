import type { MetadataRoute } from "next";

import { aircraftSeoProfiles } from "@/utils/aircraftSeo";
import { airportSeoProfiles } from "@/utils/airportSeo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: "https://aerotrackr.online",
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://aerotrackr.online/flight-tracker-information",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: "https://aerotrackr.online/airport-arrivals-departures",
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://aerotrackr.online/seat-map-checker",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: "https://aerotrackr.online/about",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://aerotrackr.online/contact",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://aerotrackr.online/faq",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: "https://aerotrackr.online/privacy-policy",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: "https://aerotrackr.online/terms",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    ...airportSeoProfiles.map((airport) => ({
      url: `https://aerotrackr.online/airport/${airport.slug}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.88,
    })),
    ...aircraftSeoProfiles.map((aircraft) => ({
      url: `https://aerotrackr.online/aircraft/${aircraft.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.86,
    })),
  ];
}
