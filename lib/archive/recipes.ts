import recipes from "@/lib/archive/recipes.json";

// The recipe pages of the Tools: the refiners, the Nutrient Processor, and
// crafting by hand, from the game's tables (the No Man's Sky generator writes
// `recipes.json`; docs/crafting.md there).

export type Station = "refiner" | "cooking" | "crafting";

// One ingredient or result: the item and how many.
export type Part = [string, number];

// `[result, amount, ingredients, seconds, expedition]`, as the generator writes
// it; `expedition` is the number of the expedition whose missions alone give the
// blueprint, null for every other recipe.
export type RecipeRow = [string, number, Part[], number, number | null];

// `full`: the dish's recipe opens whole, down to what you gather (a scan bonus of
// +6,000% or more, as the No Man's Sky generator marks it).
export type Food = {
  stat: string;
  bonus: string;
  seconds: number;
  full: boolean;
};

export type Item = {
  name: string;
  subtitle: string;
  description: string;
  value: number;
  tile: number | null;
  food: Food | null;
};

export type Book = {
  station: Station;
  rows: RecipeRow[];
  items: Record<string, Item>;
  sprite: string;
};

// A recipe takes one ingredient in the Portable Refiner, two in the Medium,
// three in the Large (the owner, 2026-11-08); the Nutrient Processor and the
// crafting menu take up to three as well.
export const SLOTS = 3;

// `substance`: gathered, not made, so a whole recipe tree stops at it.
export type Stored = {
  name: string;
  subtitle: string;
  description: string;
  value: number;
  tiles: Partial<Record<Station, number>>;
  food: Food | null;
  substance: boolean;
};

// One station's recipes and only the items they name, so a page sends no more
// than it shows.
export function bookOf(station: Station): Book {
  const rows = recipes[station] as RecipeRow[];
  const stored = recipes.items as Record<string, Stored>;
  const items: Record<string, Item> = {};
  for (const [result, , parts] of rows) {
    for (const id of [result, ...parts.map((part) => part[0])]) {
      const item = stored[id];
      items[id] ??= {
        name: item.name,
        subtitle: item.subtitle,
        description: item.description,
        value: item.value,
        tile: item.tiles[station] ?? null,
        food: item.food,
      };
    }
  }
  return { station, rows, items, sprite: `/recipes/${station}.webp` };
}
