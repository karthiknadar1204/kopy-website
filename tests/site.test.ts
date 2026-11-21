import assert from "node:assert/strict";
import test from "node:test";
import { siteOrigin, testCheckout } from "../lib/site";
import {
  documentAt,
  documentMarkdown,
  documents,
  markdownPath,
} from "../lib/content";

test("only explicit Dodo test checkout URLs can become buy actions", () => {
  for (const value of [
    undefined,
    "",
    "javascript:alert(1)",
    "https://checkout.dodopayments.com/buy/pdt_live",
    "https://test.checkout.dodopayments.com.evil.example/buy/pdt_123",
    "https://test.checkout.dodopayments.com@evil.example/buy/pdt_123",
    "https://user:secret@test.checkout.dodopayments.com/buy/pdt_123",
    "http://test.checkout.dodopayments.com/buy/pdt_123",
    "https://test.checkout.dodopayments.com:4430/buy/pdt_123",
    "https://test.checkout.dodopayments.com/redirect/elsewhere",
  ]) {
    assert.equal(testCheckout(value).kind, "unavailable", String(value));
  }
  for (const path of ["/buy/pdt_test123?quantity=1", "/session/cks_test123"]) {
    const checkout = testCheckout(
      `https://test.checkout.dodopayments.com${path}`,
    );
    assert.equal(checkout.kind, "test");
    if (checkout.kind === "test")
      assert.equal(checkout.url.hostname, "test.checkout.dodopayments.com");
  }
});

test("canonicals use a validated origin rather than an arbitrary path or credential-bearing URL", () => {
  assert.equal(siteOrigin(undefined).href, "https://kopy-website.vercel.app/");
  assert.equal(
    siteOrigin("https://kopy.example").href,
    "https://kopy.example/",
  );
  assert.equal(
    siteOrigin("http://localhost:3000").href,
    "http://localhost:3000/",
  );
  for (const value of [
    "https://user:pass@kopy.example",
    "http://kopy.example",
    "https://kopy.example/private",
    "https://kopy.example/?key=secret",
  ])
    assert.throws(() => siteOrigin(value));
});

test("the public document registry has unique routes and only links to existing local content", () => {
  assert.equal(
    new Set(documents.map((document) => document.path)).size,
    documents.length,
  );
  assert.equal(
    new Set(documents.map((document) => markdownPath(document.path))).size,
    documents.length,
  );
  for (const document of documents) {
    assert.ok(document.blocks.length > 0);
    assert.match(document.updated, /^\d{4}-\d{2}-\d{2}$/);
    for (const block of document.blocks) {
      if (block.kind === "links")
        for (const link of block.links)
          if (link.href.startsWith("/"))
            assert.ok(documentAt(link.href), link.href);
    }
  }
  for (const privatePath of [
    "/api",
    "/admin",
    "/dashboard",
    "/buy",
    "/.env.local",
    "/licences",
  ])
    assert.equal(documentAt(privatePath), undefined);
});

test("markdown is generated from every public document and keeps canonical HTML links", () => {
  const origin = new URL("https://kopy.example");
  for (const document of documents) {
    const markdown = documentMarkdown(document, origin);
    assert.ok(markdown.startsWith(`# ${document.title}\n`));
    assert.ok(
      markdown.includes(`Canonical: ${new URL(document.path, origin).href}`),
    );
    for (const block of document.blocks) {
      if (block.kind === "paragraph" || block.kind === "heading")
        assert.ok(markdown.includes(block.text));
      if (block.kind === "list" || block.kind === "steps")
        for (const item of block.items) assert.ok(markdown.includes(item));
      if (block.kind === "links")
        for (const link of block.links)
          assert.ok(markdown.includes(new URL(link.href, origin).href));
    }
  }
});

test("the Markdown handler supports the original public rewrite URL and refuses unknown/private paths", async () => {
  const { GET } = await import("../app/api/markdown/route");
  for (const document of documents) {
    const response = GET(
      new Request(`https://kopy.example${markdownPath(document.path)}`),
    );
    assert.equal(response.status, 200);
    assert.ok((await response.text()).includes(`# ${document.title}`));
    assert.equal(
      response.headers.get("content-location"),
      new URL(document.path, siteOrigin(undefined)).href,
    );
    assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/);
  }
  assert.equal(GET(new Request("https://kopy.example/admin.md")).status, 404);
  assert.equal(
    GET(new Request("https://kopy.example/api/markdown?path=/.env.local"))
      .status,
    404,
  );
  const alias = await GET(
    new Request("https://kopy.example/privacy.md?path=/support"),
  ).text();
  assert.ok(alias.startsWith("# Kopy privacy policy"));
});
