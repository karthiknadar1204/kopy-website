export type Checkout = { kind: "unavailable" } | { kind: "test"; url: URL };

export function testCheckout(value: string | undefined): Checkout {
  if (!value) return { kind: "unavailable" };
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "test.checkout.dodopayments.com" || url.port || url.username || url.password || !/^\/(session|buy)\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)) {
      return { kind: "unavailable" };
    }
    return { kind: "test", url };
  } catch {
    return { kind: "unavailable" };
  }
}

export function siteOrigin(value: string | undefined): URL {
  if (!value) return new URL("https://kopy-website.vercel.app");
  const url = new URL(value);
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if ((url.protocol !== "https:" && !(local && url.protocol === "http:")) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("SITE_URL must be an HTTPS origin, or an HTTP localhost origin for development.");
  }
  return url;
}

export const site = {
  origin: siteOrigin(process.env.SITE_URL),
  indexable: process.env.SITE_INDEXABLE === "true",
  supportEmail: "karthiknadar1204@gmail.com",
  price: "$2.99",
  updated: "2026-11-21",
};

export function absolute(path: string): string {
  return new URL(path, site.origin).href;
}
