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
  { name: "Refiner recipes" },
];

export const metadata: Metadata = {
  title:
    "No Man's Sky refiner recipes: Portable, Medium, and Large — Seed Archive",
  alternates: { canonical: "/tools/refiner-recipes" },
  description:
    "Every No Man's Sky refiner recipe, filtered by the ingredients you hold or the item you want, with the refiner each one needs.",
};

export default async function RefinerRecipesPage() {
  return (
    <>
      <StructuredData data={trailData(TRAIL)} />
      <PageTrail steps={TRAIL} />
      <RecipeBook
        html={await readContent("refiner-recipes")}
        book={bookOf("refiner")}
      />
    </>
  );
}
