import type { Metadata } from "next";
import { PageTrail } from "@seed-archive/ui/page-trail";

import { RecipeBook } from "@/components/archive/RecipeBook";
import { StructuredData } from "@/components/archive/StructuredData";
import { readContent } from "@/lib/archive/content";
import { bookOf } from "@/lib/archive/recipes";
import { trailData } from "@/lib/archive/trail";

const TRAIL = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Nutrient Processor recipes" },
];

export const metadata: Metadata = {
  title:
    "No Man's Sky cooking recipes: every Nutrient Processor dish — Seed Archive",
  alternates: { canonical: "/tools/cooking-recipes" },
  description:
    "Every No Man's Sky Nutrient Processor recipe, filtered by ingredient or dish, with each dish's sell value and its bonus in the Nutrient Ingestor.",
};

export default async function CookingRecipesPage() {
  return (
    <>
      <StructuredData data={trailData(TRAIL)} />
      <PageTrail steps={TRAIL} />
      <RecipeBook
        html={await readContent("cooking-recipes")}
        book={bookOf("cooking")}
      />
    </>
  );
}
