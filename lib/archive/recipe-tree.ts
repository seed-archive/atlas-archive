import type { TreeNode } from "@/components/archive/RecipeTree";
import recipes from "@/lib/archive/recipes.json";
import type { RecipeRow, Station, Stored } from "@/lib/archive/recipes";

// An item's recipe as a tree, drawn as the game draws "Item Assembly Steps", in two
// depths: Short, the last step alone; Full, every step down to what you gather,
// through the Nutrient Processor, the refiners, and crafting by hand.

const STATIONS: Station[] = ["cooking", "refiner", "crafting"];

// How deep a full tree goes before it stops: our own choice, deeper than any
// chain the game's tables need for a dish.
const FULL_DEPTH = 6;

const items = recipes.items as Record<string, Stored>;

type Way = { station: Station; row: RecipeRow };

// Every recipe of each item across the stations, an expedition's crafts left
// out, since a player cannot learn them now.
const ways = new Map<string, Way[]>();
for (const station of STATIONS) {
  for (const row of recipes[station] as RecipeRow[]) {
    if (row[4] === null) {
      ways.set(row[0], [...(ways.get(row[0]) ?? []), { station, row }]);
    }
  }
}

const valueOf = (id: string) => items[id]?.value ?? 0;

// What one of `id` costs at base value made the cheapest way, and that way: a
// substance is gathered, so it stays a leaf, and a product is made only when its
// ingredients cost less than the product itself.
function cheapest(id: string, path: string[]): { cost: number; way?: Way } {
  let best: { cost: number; way?: Way } = { cost: valueOf(id) };
  if (items[id]?.substance || path.length >= FULL_DEPTH || path.includes(id)) {
    return best;
  }
  for (const way of ways.get(id) ?? []) {
    const [, amount, parts] = way.row;
    const cost =
      parts.reduce(
        (sum, [part, count]) =>
          sum + count * cheapest(part, [...path, id]).cost,
        0,
      ) / amount;
    if (cost < best.cost) {
      best = { cost, way };
    }
  }
  return best;
}

// The picture of `id`: the sprite of the station that makes it, or of the first
// station that draws it.
function picture(id: string, station?: Station) {
  const tiles = items[id]?.tiles ?? {};
  const at =
    station && tiles[station] !== undefined
      ? station
      : STATIONS.find((one) => tiles[one] !== undefined);
  return at
    ? { tile: tiles[at] ?? null, sprite: `/recipes/${at}.webp` }
    : { tile: null, sprite: undefined };
}

function node(
  id: string,
  amount: number,
  way: Way | undefined,
  parts: (part: string, count: number) => TreeNode,
): TreeNode {
  const { tile, sprite } = picture(id, way?.station);
  const batches = way ? Math.ceil(amount / way.row[1]) : 0;
  return {
    item: [items[id]?.name ?? id, amount, tile],
    ...(sprite ? { sprite } : {}),
    parts: way
      ? way.row[2].map(([part, count]) => parts(part, count * batches))
      : [],
  };
}

function full(id: string, amount: number, path: string[]): TreeNode {
  const { way } = cheapest(id, path);
  return node(id, amount, way, (part, count) =>
    full(part, count, [...path, id]),
  );
}

// The tree of `row`, a recipe of a station: its last step alone, or every step,
// the first one being this recipe and the rest the cheapest.
export function recipeTrees(row: RecipeRow, station: Station) {
  const way = { station, row };
  return {
    short: node(row[0], row[1], way, (part, count) =>
      node(part, count, undefined, () => ({ item: ["", 0, null], parts: [] })),
    ),
    full: node(row[0], row[1], way, (part, count) =>
      full(part, count, [row[0]]),
    ),
  };
}

// The cheapest recipe of `id` that a player can learn, as trees.
export function dishTrees(id: string) {
  const way = cheapest(id, []).way ?? ways.get(id)?.[0];
  return way ? recipeTrees(way.row, way.station) : undefined;
}
