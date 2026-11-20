import type { Metadata } from "next";
import { PageTrail } from "@seed-archive/ui/page-trail";

import { StarshipFinder } from "@/components/archive/StarshipFinder";
import { StructuredData } from "@/components/archive/StructuredData";
import { readContent } from "@/lib/archive/content";
import { trailData } from "@/lib/archive/trail";

const TRAIL = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Starships" },
];

export const metadata: Metadata = {
  title:
    "No Man's Sky starship builder: every shape of every ship type — Seed Archive",
  alternates: { canonical: "/tools/starship-finder" },
  description:
    "Starships in No Man's Sky: put an exotic, a solar ship, a Fighter, a hauler, an explorer, or a shuttle together from its parts and see every shape the game makes, the rare squid included.",
};

export default async function StarshipFinderPage() {
  return (
    <>
      <StructuredData data={trailData(TRAIL)} />
      <PageTrail steps={TRAIL} />
      <StarshipFinder html={await readContent("starship-finder")} />
    </>
  );
}
