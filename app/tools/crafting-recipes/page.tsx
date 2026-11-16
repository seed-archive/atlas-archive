import type { Metadata } from "next";

import { PageTrail } from "@/components/archive/PageTrail";
import { RecipeBook } from "@/components/archive/RecipeBook";
import { StructuredData } from "@/components/archive/StructuredData";
import { readContent } from "@/lib/archive/content";
import { bookOf } from "@/lib/archive/recipes";
import { trailData } from "@/lib/archive/trail";

const TRAIL = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Crafting recipes" },
];

export const metadata: Metadata = {
  title:
    "No Man's Sky crafting recipes: everything you craft by hand — Seed Archive",
  alternates: { canonical: "/tools/crafting-recipes" },
  description:
    "Every No Man's Sky crafting recipe, filtered by the parts you hold or the item you need, with each item's sell value.",
};

export default async function CraftingRecipesPage() {
  return (
    <>
      <StructuredData data={trailData(TRAIL)} />
      <PageTrail steps={TRAIL} />
      <RecipeBook
        html={await readContent("crafting-recipes")}
        book={bookOf("crafting")}
      />
    </>
  );
}
