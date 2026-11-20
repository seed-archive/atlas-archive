import groups from "@/lib/archive/scientific-groups.json";
import type { PartGroup } from "@/lib/archive/builder/parts";
import type { ShipModule } from "@/lib/archive/builder/ship";
import { BASE_PATH } from "@/lib/site";

// The Scientific starship, the explorer, on /tools/starship-finder, a hull of its
// switch. The groups are the choices of the game's own tree of explorer parts, written
// by the No Man's Sky generator: the cockpit with its canopy and accessories, and
// the wings, matched or a left and a right of their own. Its colours are not read yet,
// so the ship is grey.
export const SCIENTIFIC: ShipModule = {
  kind: "scientific",
  // Written by the No Man's Sky generator.
  folder: `${BASE_PATH}/scientific`,
  format: "grey",
  groups: groups as PartGroup[],
  always: [],
  label: "archive.scientificShip",
};
