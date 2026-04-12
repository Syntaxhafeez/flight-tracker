import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AeroTrack Live Flight Tracker",
    short_name: "AeroTrack",
    description:
      "Live flight tracking with real-time positions, airport intelligence, aircraft details, and seat maps.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1220",
    theme_color: "#0ea5e9",
    icons: [
      {
        src: "/icon.svg",
        sizes: "128x128",
        type: "image/svg+xml",
      },
    ],
  };
}
