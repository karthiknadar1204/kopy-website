import assert from "node:assert/strict";
import { documents, markdownPath } from "../lib/content";
import { siteOrigin } from "../lib/site";
const origin = siteOrigin(process.env.CHECK_SITE_URL);
const htmlPaths = [
  ...documents.map((document) => document.path),
  "/buy",
  "/purchase-complete",
];
const paths = [
  ...htmlPaths,
  ...documents.map((document) => markdownPath(document.path)),
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/llms-full.txt",
  "/ai.txt",
  "/opengraph-image",
];
const knownPaths = new Set(paths);
const failures: string[] = [];
for (const path of paths) {
  try {
    const response = await fetch(new URL(path, origin), {
      signal: AbortSignal.timeout(15000),
      redirect: "error",
    });
    assert.equal(response.status, 200, `${path}: ${response.status}`);
    if (path === "/opengraph-image") {
      assert.ok(
        response.headers.get("content-type")?.startsWith("image/"),
        "Share preview must be an image",
      );
      assert.ok(
        (await response.arrayBuffer()).byteLength > 0,
        "Share preview is empty",
      );
    } else {
      const content = await response.text();
      assert.ok(content.length > 0, `${path}: empty response`);
      if (path.endsWith(".md")) {
        assert.ok(
          response.headers.get("content-type")?.includes("text/markdown"),
          `${path}: incorrect type`,
        );
        assert.ok(
          response.headers.get("x-robots-tag")?.includes("noindex"),
          `${path}: missing noindex`,
        );
      }
      if (htmlPaths.includes(path)) {
        assert.ok(
          response.headers.get("x-robots-tag")?.includes("noindex"),
          `${path}: preview header must remain noindex`,
        );
        assert.match(
          content,
          /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/,
          `${path}: preview HTML must remain noindex`,
        );
        if (path !== "/purchase-complete") {
          const canonical = content.match(
            /<link\b(?=[^>]*\brel="canonical")[^>]*>/,
          )?.[0];
          const canonicalHref = canonical?.match(/\bhref="([^"]+)"/)?.[1];
          assert.ok(canonicalHref, `${path}: canonical URL is missing`);
          assert.equal(
            new URL(canonicalHref).href,
            new URL(path, origin).href,
            `${path}: canonical must match the public HTML URL`,
          );
        }
        for (const match of content.matchAll(/href="(\/[^"?]*)"/g)) {
          const linkedPath = new URL(match[1], origin).pathname;
          if (
            linkedPath.startsWith("/_next/") ||
            linkedPath.startsWith("/images/")
          )
            continue;
          assert.ok(
            knownPaths.has(linkedPath),
            `${path}: unknown internal destination ${linkedPath}`,
          );
        }
      }
      if (path === "/sitemap.xml") {
        const sitemapUrls = [...content.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
          (match) => new URL(match[1]),
        );
        for (const url of sitemapUrls)
          assert.equal(url.origin, origin.origin, "Sitemap origin must match the public site");
        assert.deepEqual(
          sitemapUrls.map((url) => url.pathname).sort(),
          documents.map((document) => document.path).sort(),
          "Sitemap must contain canonical public HTML documents only",
        );
      }
    }
    process.stdout.write(`PASS ${path}\n`);
  } catch (error) {
    failures.push(
      `${path}: ${error instanceof Error ? error.message : "request failed"}`,
    );
  }
}
if (failures.length) {
  process.stderr.write(`${failures.join("\n")}\n`);
  process.exitCode = 1;
}
