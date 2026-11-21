import { documents, documentMarkdown, markdownPath } from "./content";
import { absolute, site } from "./site";
export function llmsIndex(): string {
  return `# Kopy\n\n> A native macOS clipboard history and file shelf. Prelaunch preview, with a planned $2.99 one-time direct purchase and no customer account.\n\nHistory stays encrypted on the Mac. File references depend on their originals. The direct and Store builds have different paste workflows.\n\n## Public pages\n${documents.map((document) => `- [${document.title}](${absolute(markdownPath(document.path))}): ${document.description}`).join("\n")}\n\n## Machine-readable\n- [All public content](${absolute("/llms-full.txt")})\n- [Sitemap](${absolute("/sitemap.xml")})\n\nContact: ${site.supportEmail}\n`;
}
export function fullContent(): string {
  return documents
    .map(
      (document) =>
        `<!-- source: ${absolute(document.path)} -->\n${documentMarkdown(document, site.origin)}`,
    )
    .join("\n---\n\n");
}
export function textResponse(text: string): Response {
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, follow",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
