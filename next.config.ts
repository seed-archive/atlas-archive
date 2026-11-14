import { withSentryConfig } from "@sentry/nextjs/config";
import { readFileSync } from "node:fs";
import path from "node:path";

import type { NextConfig } from "next";

import { BASE_PATH, LEGACY_HOST } from "./lib/site";

// The guides menu the generator writes: each group and its guides.
const MENU: { slug: string; pages: { slug: string }[] }[] = JSON.parse(
  readFileSync(
    path.join(process.cwd(), "lib/archive/statistics-menu.json"),
    "utf8",
  ),
);

type Move = { source: string; destination: string };

// The old paths of the guides, each to its page now, inside this section.
// Statistics became Guides on 2026-11-03, and each guide moved under its group
// on 2026-11-05: /guides/<slug> to /guides/<group>/<slug>. Where a group and a
// guide share a word (galaxies, systems, freighters) the short path is now the
// group's own page and leads to the guide from there.
function guideMoves(): Move[] {
  const long = (slug: string) => {
    const group = MENU.find((one) =>
      one.pages.some((page) => page.slug === slug),
    );
    return group ? `/guides/${group.slug}/${slug}` : "/guides";
  };
  const groups = new Set(MENU.map((group) => group.slug));
  const guides = MENU.flatMap((group) => group.pages.map((page) => page.slug));
  return [
    { source: "/statistics", destination: "/guides" },
    // The guide was Station upgrade modules until 2026-11-05.
    ...["statistics", "guides"].map((root) => ({
      source: `/${root}/station-upgrades`,
      destination: long("technology-merchants"),
    })),
    // Frigate traits became a section of Frigates on 2026-11-07.
    ...[
      "/statistics/frigate-traits",
      "/guides/frigate-traits",
      "/guides/freighters/frigate-traits",
    ].map((source) => ({
      source,
      destination: `${long("frigates")}#frigate-traits`,
    })),
    // Excavation finds became the Fossil Collector's guide on 2026-11-11.
    ...[
      "/statistics/excavation-finds",
      "/guides/excavation-finds",
      "/guides/planets/excavation-finds",
    ].map((source) => ({ source, destination: long("fossil-collector") })),
    ...guides.map((slug) => ({
      source: `/statistics/${slug}`,
      destination: long(slug),
    })),
    ...guides
      .filter((slug) => !groups.has(slug))
      .map((slug) => ({ source: `/guides/${slug}`, destination: long(slug) })),
  ];
}

// Every redirect, in the order Next.js tries them. A path from outside this
// section (the old address, a path without the prefix) that names an old guide
// goes straight to the guide's page now, in one step, before the general rule
// that only adds the prefix.
function redirectList() {
  const moves = guideMoves();
  const legacy = { type: "host" as const, value: LEGACY_HOST };
  const newSite = `https://seedarchive.gg${BASE_PATH}`;
  return [
    // The site from before the move: every path to the same page on the new
    // domain. Built in only when the deploy sets LEGACY_HOST_REDIRECT, so the
    // old address keeps working until seedarchive.gg answers.
    ...(process.env.LEGACY_HOST_REDIRECT
      ? [
          // The old home, with or without the prefix, to the section's home
          // itself: the rules below would add a slash and one more step.
          ...["/", BASE_PATH].map((from) => ({
            source: from,
            has: [legacy],
            destination: newSite,
            basePath: false as const,
            permanent: true,
          })),
          ...moves.flatMap(({ source, destination }) =>
            [source, `${BASE_PATH}${source}`].map((from) => ({
              source: from,
              has: [legacy],
              destination: `${newSite}${destination}`,
              basePath: false as const,
              permanent: true,
            })),
          ),
          {
            source: `${BASE_PATH}/:path*`,
            has: [legacy],
            destination: `${newSite}/:path*`,
            basePath: false as const,
            permanent: true,
          },
          {
            source: "/:path*",
            has: [legacy],
            destination: `${newSite}/:path*`,
            basePath: false as const,
            permanent: true,
          },
        ]
      : []),
    // The root becomes the page of Seed Archive itself once there is more than
    // one game, so it leads to this section only for now.
    {
      source: "/",
      destination: BASE_PATH,
      basePath: false as const,
      permanent: false,
    },
    // An old guide's path without the prefix, straight to its page.
    ...moves.map(({ source, destination }) => ({
      source,
      destination: `${BASE_PATH}${destination}`,
      basePath: false as const,
      permanent: true,
    })),
    // Every other path without the prefix: the old links of the site and any
    // path written as text. Next.js prefixes only its own links (next/link,
    // redirect, router). /_vercel/ is Vercel's own (Web Analytics), and
    // /no-mans-sky.rsc is the data of the section's own home page, so neither
    // is redirected.
    {
      source: `/:path((?!${BASE_PATH.slice(1)}(?:[/.]|$)|_vercel/).+)`,
      destination: `${BASE_PATH}/:path`,
      basePath: false as const,
      permanent: true,
    },
    // The old guide paths inside this section.
    ...moves.map((move) => ({ ...move, permanent: true })),
  ];
}

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  // Pages read content/ at run time, so Vercel has to ship it.
  outputFileTracingIncludes: { "/**": ["./content/**"] },
  async redirects() {
    return redirectList();
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  webpack: {
    automaticVercelMonitors: false,
  },
});
