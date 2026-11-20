import groups from "@/lib/archive/fighter-groups.json";
import type { PartGroup } from "@/lib/archive/builder/parts";
import type { ShipModule } from "@/lib/archive/builder/ship";
import { BASE_PATH } from "@/lib/site";

// The Fighter on /tools/starship-finder, a hull of its switch. The groups are the
// choices of the game's own tree of Fighter parts, written by the No Man's Sky
// generator: the engine, the wings with their accessory and sub-wings, and the cockpit
// with its nose. Its colours are not read yet, so the ship is grey.
export const FIGHTER: ShipModule = {
  kind: "fighter",
  // Written by the No Man's Sky generator.
  folder: `${BASE_PATH}/fighter`,
  format: "grey",
  groups: groups as PartGroup[],
  always: [],
  label: "archive.fighterShip",
};
