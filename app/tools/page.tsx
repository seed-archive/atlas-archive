import type { Metadata } from "next";
import { PageTrail } from "@seed-archive/ui/page-trail";

import { Article } from "@/components/archive/Article";
import { StructuredData } from "@/components/archive/StructuredData";
import { readContent } from "@/lib/archive/content";
import { trailData } from "@/lib/archive/trail";

const TRAIL = [{ name: "Home", href: "/" }, { name: "Tools" }];

export const metadata: Metadata = {
  title:
    "No Man's Sky tools: ship builders, luck score, and recipes — Seed Archive",
  alternates: { canonical: "/tools" },
  description:
    "No Man's Sky tools: build an Interceptor, a freighter, or a living ship, score a find, and look up every refiner, cooking, and crafting recipe.",
};

export default async function ToolsPage() {
  return (
    <>
      <StructuredData data={trailData(TRAIL)} />
      <PageTrail steps={TRAIL} />
      <Article html={await readContent("tools")} widgets={{}} />
    </>
  );
}
