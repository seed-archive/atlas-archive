import groups from "@/lib/archive/exotic-groups.json";
import type { PartGroup } from "@/lib/archive/builder/parts";
import type { ShipModule } from "@/lib/archive/builder/ship";
import { BASE_PATH } from "@/lib/site";

// The exotic starship on /tools/starship-finder, the first hull of its switch. The
// groups are the choices of the game's own tree of exotic parts, written by the No
// Man's Sky generator: the Royal body with its engine, wings, and top wing, or the
// squid, one fixed shape. Its colours are not read yet, so the ship is grey.
export const EXOTIC: ShipModule = {
  kind: "exotic",
  // Written by the No Man's Sky generator.
  folder: `${BASE_PATH}/exotic`,
  format: "grey",
  groups: groups as PartGroup[],
  always: [],
  label: "archive.exoticShip",
};
