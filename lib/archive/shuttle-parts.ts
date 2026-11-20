import groups from "@/lib/archive/shuttle-groups.json";
import type { PartGroup } from "@/lib/archive/builder/parts";
import type { ShipModule } from "@/lib/archive/builder/ship";
import { BASE_PATH } from "@/lib/site";

// The Shuttle on /tools/starship-finder, a hull of its switch. The groups are the
// choices of the game's own tree of Shuttle parts, written by the No Man's Sky
// generator: a single or a double hull with its cockpit, wings, thrusters, lamps, and
// accessories. Its colours are not read yet, so the ship is grey.
export const SHUTTLE: ShipModule = {
  kind: "shuttle",
  // Written by the No Man's Sky generator.
  folder: `${BASE_PATH}/shuttle`,
  format: "grey",
  groups: groups as PartGroup[],
  always: [],
  label: "archive.shuttleShip",
};
