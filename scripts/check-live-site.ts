import assert from "node:assert/strict";
import { documents, markdownPath } from "../lib/content";
import { siteOrigin } from "../lib/site";
const origin = siteOrigin(process.env.CHECK_SITE_URL);
const failures: string[] = [];
for (const path of [...documents.map((document) => document.path), ...documents.map((document) => markdownPath(document.path)), "/sitemap.xml", "/robots.txt", "/llms.txt", "/llms-full.txt", "/buy", "/opengraph-image"]) {
  try {
    const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(15000), redirect: "error" });
    assert.equal(response.status, 200, `${path}: ${response.status}`);
    const content = await response.text();
    assert.ok(content.length > 0, `${path}: empty response`);
    if (path.endsWith(".md")) {
      assert.ok(response.headers.get("content-type")?.includes("text/markdown"), `${path}: incorrect type`);
      assert.ok(response.headers.get("x-robots-tag")?.includes("noindex"), `${path}: missing noindex`);
    }
    process.stdout.write(`PASS ${path}\n`);
  } catch (error) { failures.push(`${path}: ${error instanceof Error ? error.message : "request failed"}`); }
}
if (failures.length) { process.stderr.write(`${failures.join("\n")}\n`); process.exitCode = 1; }
