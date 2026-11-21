import { documentAt, documentMarkdown } from "@/lib/content";
import { absolute, site } from "@/lib/site";
export function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.endsWith(".md")
    ? url.pathname === "/index.md" ? "/" : url.pathname.slice(0, -3)
    : url.searchParams.get("path");
  const document = path ? documentAt(path) : undefined;
  if (!document) return new Response("# Page not found\n", { status: 404, headers: { "Content-Type": "text/markdown; charset=utf-8", "X-Robots-Tag": "noindex" } });
  const body = documentMarkdown(document, site.origin);
  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8", "Content-Location": absolute(document.path), "Link": `<${absolute(document.path)}>; rel="canonical"`, "X-Robots-Tag": "noindex, follow", "X-Markdown-Tokens": String(Math.ceil(body.length / 4)), "Cache-Control": "public, max-age=3600" } });
}
