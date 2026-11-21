import type { Metadata } from "next";
import { markdownPath, type PublicDocument } from "./content";
export function documentMetadata(document: PublicDocument): Metadata {
  return {
    title: { absolute: `${document.title} | Kopy` },
    description: document.description,
    alternates: {
      canonical: document.path,
      types: { "text/markdown": markdownPath(document.path) },
    },
    openGraph: {
      title: document.title,
      description: document.description,
      url: document.path,
      type: "article",
    },
  };
}
