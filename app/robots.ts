import type { MetadataRoute } from "next";
import { absolute, site } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/buy"] }, sitemap: absolute("/sitemap.xml"), host: site.origin.origin };
}
