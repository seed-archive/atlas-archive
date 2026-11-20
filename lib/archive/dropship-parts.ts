import groups from "@/lib/archive/dropship-groups.json";
import type { PartGroup } from "@/lib/archive/builder/parts";
import type { ShipModule } from "@/lib/archive/builder/ship";
import { BASE_PATH } from "@/lib/site";

// The Dropship, the hauler, on /tools/starship-finder, a hull of its switch. The
// groups are the choices of the game's own tree of Dropship parts, written by the No
// Man's Sky generator: the cockpit, and the hull with its wings, thrusters, sub-wings,
// containers, and engines. Its colours are not read yet, so the ship is grey.
export const DROPSHIP: ShipModule = {
  kind: "dropship",
  // Written by the No Man's Sky generator.
  folder: `${BASE_PATH}/dropship`,
  format: "grey",
  groups: groups as PartGroup[],
  always: [],
  label: "archive.dropshipShip",
};
