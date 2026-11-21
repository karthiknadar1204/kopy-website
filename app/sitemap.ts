import type { MetadataRoute } from "next";
import { documents } from "@/lib/content";
import { absolute } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return documents.map((document) => ({ url: absolute(document.path), lastModified: new Date(`${document.updated}T00:00:00Z`) }));
}
