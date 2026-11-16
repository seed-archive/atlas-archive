import Box from "@mui/material/Box";

import { BASE_PATH } from "@/lib/site";

// The one size of an item's picture on the site, framed as an inventory slot:
// every table of the guides and every recipe page draws its tiles here.
export const SLOT_TILE = 44;

// One tile of a sprite, `columns` tiles a row. A missing picture keeps the
// room, so the names beside it stay in one column.
export function SlotTile(props: {
  tile: number | null | undefined;
  sprite: { src: string; columns: number };
}) {
  const { tile, sprite } = props;
  if (tile === null || tile === undefined) {
    return (
      <Box
        sx={{ width: SLOT_TILE + 4, height: SLOT_TILE + 4, flexShrink: 0 }}
      />
    );
  }
  return (
    <Box
      role="img"
      aria-hidden
      sx={{
        width: SLOT_TILE,
        height: SLOT_TILE,
        flexShrink: 0,
        boxSizing: "content-box",
        border: "2px solid #fff",
        boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.35)",
        backgroundImage: `url(${BASE_PATH}${sprite.src})`,
        backgroundSize: `${sprite.columns * SLOT_TILE}px auto`,
        backgroundPosition: `-${(tile % sprite.columns) * SLOT_TILE}px -${Math.floor(tile / sprite.columns) * SLOT_TILE}px`,
      }}
    />
  );
}
