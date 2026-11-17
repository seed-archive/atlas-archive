import type { Metadata } from "next";
import { PageTrail } from "@seed-archive/ui/page-trail";

import { LivingFrigateFinder } from "@/components/archive/LivingFrigateFinder";
import { StructuredData } from "@/components/archive/StructuredData";
import { readContent } from "@/lib/archive/content";
import { trailData } from "@/lib/archive/trail";

const TRAIL = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Living frigates" },
];

export const metadata: Metadata = {
  title:
    "No Man's Sky living frigates: every shape of an organic frigate — Seed Archive",
  alternates: { canonical: "/tools/living-frigate-finder" },
  description:
    "Living frigates in No Man's Sky: put a cosmic whale together from its front accessory, tail, wings, and side parts, and see every shape the game makes.",
};

export default async function LivingFrigateFinderPage() {
  return (
    <>
      <StructuredData data={trailData(TRAIL)} />
      <PageTrail steps={TRAIL} />
      <LivingFrigateFinder html={await readContent("living-frigate-finder")} />
    </>
  );
}
