import { FREIGHTER_PAINT } from "@/lib/archive/freighter-paint";
import groups from "@/lib/archive/capital-freighter-groups.json";
import type { PartGroup } from "@/lib/archive/builder/parts";
import type { ShipModule } from "@/lib/archive/builder/ship";
import { BASE_PATH } from "@/lib/site";

// The capital freighter on /capital-freighter-finder, a builder. The groups are
// the choices of the game's own tree of capital freighter parts, written by
// the No Man's Sky generator; the three container lists of the cargo
// sections are tied into one `first` group, Containers. Its colours are not in
// the groups yet, so the ship is grey.
export const CAPITAL_FREIGHTER: ShipModule = {
  kind: "capital-freighter",
  // Written by the No Man's Sky generator.
  folder: `${BASE_PATH}/freighter/capital`,
  format: "textured16",
  groups: groups as PartGroup[],
  always: [],
  paint: FREIGHTER_PAINT,
  label: "archive.capitalFreighterShip",
};
