import type { Metadata } from "next";
import { PageTrail } from "@seed-archive/ui/page-trail";

import { LivingShipFinder } from "@/components/archive/LivingShipFinder";
import { StructuredData } from "@/components/archive/StructuredData";
import { readContent } from "@/lib/archive/content";
import { trailData } from "@/lib/archive/trail";

const TRAIL = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Living ships" },
];

export const metadata: Metadata = {
  title:
    "No Man's Sky living ships: every shape of a living ship — Seed Archive",
  alternates: { canonical: "/tools/living-ship-finder" },
  description:
    "Living ships in No Man's Sky: put a living ship together from its head, underside, wings, and parts, and see every shape the game makes.",
};

export default async function LivingShipFinderPage() {
  return (
    <>
      <StructuredData data={trailData(TRAIL)} />
      <PageTrail steps={TRAIL} />
      <LivingShipFinder html={await readContent("living-ship-finder")} />
    </>
  );
}
