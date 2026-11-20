import groups from "@/lib/archive/sail-groups.json";
import type { PartGroup } from "@/lib/archive/builder/parts";
import type { ShipModule } from "@/lib/archive/builder/ship";
import { BASE_PATH } from "@/lib/site";

// The solar ship on /tools/starship-finder, a hull of its switch. The groups are the
// choices of the game's own tree of solar ship parts, written by the No Man's Sky
// generator: the wing tips, the wings, the body, and the sails. Its colours are not
// read yet, so the ship is grey.
export const SAIL: ShipModule = {
  kind: "sail",
  // Written by the No Man's Sky generator.
  folder: `${BASE_PATH}/sail`,
  format: "grey",
  groups: groups as PartGroup[],
  always: [],
  label: "archive.sailShip",
};
