import { count, roundEven, share, twoFigures } from "@seed-archive/ui/numbers";

import type { LoopGroup } from "@/components/archive/RecipeTree";

// How a value of statistics.json prints: the one place a share, a count, or a
// "one in N" becomes text. The file holds numbers, so tables can be charted and
// localised.

export type Kind =
  | "share"
  | "count"
  | "median"
  | "oneIn"
  | "smallShare"
  | "tenths"
  | "about"
  | "plain"
  | "plus";

// A number with how it prints.
export type Mark = { k: Kind; v: number };
// Words with marks in them: `{0}` stands for `v[0]`.
export type Template = { t: string; v: Mark[] };
export type Value = string | Mark | Template;
// In a table a bare number takes its column's kind, and null is a dash.
export type Cell = Value | number | null;

export type ColumnKind = Kind | "text" | "mixed";

// One item of a table cell: its name, how many (0 prints no count), and its tile.
export type ItemPart = [string, number, number | null];

export type RawTable = {
  head: string[];
  kinds: ColumnKind[];
  rows: Cell[][];
  note: string;
  // Where a row names a figure: its four cells.
  marks?: [number, number][][];
  // One cell of each row's figure drawn apart, such as a weapon's.
  accents?: [number, number][];
  // Column heads set upright, for a table with many narrow columns.
  upright?: boolean;
  // How many columns from the start hold words.
  text?: number;
  // Each row's tile in the page's sprite, or null for a row with no picture.
  icons?: (number | null)[];
  // The sprite: a grid of square tiles, `columns` to a row.
  sprite?: { src: string; columns: number };
  // Columns that hold items: for each row, each column's items as `[name,
  // amount, tile]`, or null where the column holds plain text or a number.
  items?: (ItemPart[] | null)[][];
  // Refiner loops drawn as recipe trees, one group a circle (`components/archive/RecipeTree`).
  trees?: LoopGroup[];
  // Dishes whose whole recipe the site draws (`lib/archive/recipe-tree`), by id.
  dishes?: string[];
};

export const DASH = "—";

export { count, share };

function median(value: number) {
  return value >= 10 || value === Math.trunc(value)
    ? count(value)
    : value.toFixed(1);
}

function oneIn(value: number) {
  const figures = twoFigures(value);
  return `one in ${figures >= 1000 ? count(figures) : figures}`;
}

function smallShare(value: number) {
  return value >= 0.0001 ? share(value) : "under 0.01%";
}

// A count in running text, to two figures: the exact number moves with every
// recount.
function about(value: number) {
  if (value < 100) {
    return count(value);
  }
  const scale = 10 ** (String(Math.round(value)).length - 2);
  return `about ${count(roundEven(value / scale) * scale)}`;
}

export function printNumber(kind: Kind, value: number) {
  switch (kind) {
    case "share":
      return share(value);
    case "count":
      return count(value);
    case "median":
      return median(value);
    case "oneIn":
      return oneIn(value);
    case "smallShare":
      return smallShare(value);
    case "tenths":
      return value.toFixed(1);
    case "about":
      return about(value);
    case "plain":
      return String(value);
    case "plus":
      return `+${value}`;
  }
}

export function printValue(value: Value): string {
  if (typeof value === "string") {
    return value;
  }
  if ("t" in value) {
    return value.t.replace(/\{(\d+)\}/g, (_, at: string) =>
      printValue(value.v[Number(at)]),
    );
  }
  return printNumber(value.k, value.v);
}

export function printCell(cell: Cell, kind: ColumnKind) {
  if (cell === null) {
    return DASH;
  }
  if (typeof cell === "number") {
    return printNumber(kind as Kind, cell);
  }
  return printValue(cell);
}
