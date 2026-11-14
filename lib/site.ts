// Seed Archive serves each game under its own section of one domain:
// seedarchive.gg/no-mans-sky/… This app is the No Man's Sky section. Next.js
// prefixes its own links (next/link, redirect, router) with it; a raw path
// written into HTML or a stylesheet does not get it (see next.config.ts).
export const BASE_PATH = "/no-mans-sky";

// The address the site had before the move to seedarchive.gg.
export const LEGACY_HOST = "atlas-archive-tau.vercel.app";

// The one counter of the whole of Seed Archive, in the portal's Vercel project
// (the portal's docs/analytics.md): its script and its events go to this path at
// the domain's root, which the portal serves, so every section counts in one place.
export const SHARED_ANALYTICS = "/933b9afd1a52216d";
