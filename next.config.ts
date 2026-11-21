import type { NextConfig } from "next";
import { documents, markdownPath } from "./lib/content";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return documents.map((document) => ({
      source: markdownPath(document.path),
      destination: "/api/markdown",
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...(process.env.SITE_INDEXABLE !== "true"
            ? [{ key: "X-Robots-Tag", value: "noindex, follow" }]
            : []),
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
          },
        ],
      },
    ];
  },
};
export default nextConfig;
