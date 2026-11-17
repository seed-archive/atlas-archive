"use client";

import { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SLOT_TILE, SlotTile } from "@seed-archive/ui/slot-tile";

import type { ItemPart } from "@/lib/archive/statistics-format";
import { BASE_PATH } from "@/lib/site";

// A recipe drawn as the game draws "Item Assembly Steps": what you make on top,
// what it takes under it on bracket lines, down to the raw resources.
export type TreeNode = { item: ItemPart; parts: TreeNode[] };

export type LoopVariant = {
  tree: TreeNode;
  start: number;
  value: number;
  minutes: number;
  hour: number;
};
export type LoopGroup = { variants: LoopVariant[] };

type Sprite = { src: string; columns: number };

// The room a slot takes with its name over it: our own choice, a little wider
// than the slot so a name of two words fits on one line in a small font.
const NODE_WIDTH = SLOT_TILE + 44;
// The length of each stroke of the bracket lines.
const STEM = 12;

const LINE = "1px solid";

function Slot(props: { part: ItemPart; sprite: Sprite }) {
  const [name, amount, tile] = props.part;
  return (
    <Stack spacing={0.5} sx={{ alignItems: "center", width: NODE_WIDTH }}>
      <Typography
        variant="caption"
        noWrap
        title={name}
        sx={{ maxWidth: NODE_WIDTH, lineHeight: 1.2 }}
      >
        {name}
      </Typography>
      <Box sx={{ position: "relative" }}>
        <SlotTile tile={tile} sprite={props.sprite} basePath={BASE_PATH} />
        {amount > 0 ? (
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              right: 4,
              bottom: 2,
              color: "#fff",
              fontWeight: 600,
              textShadow: "0 0 3px #000, 0 0 2px #000",
            }}
          >
            {amount.toLocaleString("en")}
          </Typography>
        ) : null}
      </Box>
    </Stack>
  );
}

function Node(props: { node: TreeNode; sprite: Sprite }) {
  const { node, sprite } = props;
  return (
    <Stack sx={{ alignItems: "center" }}>
      <Slot part={node.item} sprite={sprite} />
      {node.parts.length ? (
        <>
          <Box
            sx={{ height: STEM, borderLeft: LINE, borderColor: "divider" }}
          />
          <Stack direction="row">
            {node.parts.map((part, at) => (
              <Box
                key={at}
                sx={{
                  position: "relative",
                  pt: `${STEM}px`,
                  px: 0.5,
                  // The bracket: a stroke across to the next part, and one down.
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: at === 0 ? "50%" : 0,
                    right: at === node.parts.length - 1 ? "50%" : 0,
                    borderTop: node.parts.length > 1 ? LINE : "none",
                    borderColor: "divider",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    height: STEM,
                    borderLeft: LINE,
                    borderColor: "divider",
                  },
                }}
              >
                <Node node={part} sprite={sprite} />
              </Box>
            ))}
          </Stack>
        </>
      ) : null}
    </Stack>
  );
}

// A tree wider than its card scrolls inside it, opened at the middle so the item
// on top is in view.
export function RecipeTree(props: { tree: TreeNode; sprite: Sprite }) {
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = frame.current;
    if (box) {
      box.scrollLeft = (box.scrollWidth - box.clientWidth) / 2;
    }
  }, []);
  return (
    <Box ref={frame} sx={{ overflowX: "auto", py: 1 }}>
      <Box sx={{ width: "max-content", mx: "auto" }}>
        <Node node={props.tree} sprite={props.sprite} />
      </Box>
    </Box>
  );
}

function Gain(props: { variant: LoopVariant }) {
  return (
    <Typography variant="body2">
      <FormattedMessage
        id="recipes.gain"
        values={{
          value: props.variant.value.toLocaleString("en"),
          start: props.variant.start.toLocaleString("en"),
          minutes: props.variant.minutes.toLocaleString("en"),
          hour: props.variant.hour.toLocaleString("en"),
        }}
      />
    </Typography>
  );
}

// One circle of refiner recipes, titled by what it makes: its best variant
// drawn, the others behind a button at the bottom right, each with its own tree
// and gain.
function LoopCard(props: { group: LoopGroup; sprite: Sprite }) {
  const [open, setOpen] = useState(false);
  const [best, ...others] = props.group.variants;
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" component="h3">
        {best.tree.item[0]}
      </Typography>
      <Box sx={{ color: "text.secondary" }}>
        <Gain variant={best} />
      </Box>
      <RecipeTree tree={best.tree} sprite={props.sprite} />
      {others.length ? (
        <>
          <Collapse in={open} unmountOnExit>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {others.map((variant, at) => (
                <Box key={at}>
                  <Box sx={{ color: "text.secondary" }}>
                    <Gain variant={variant} />
                  </Box>
                  <RecipeTree tree={variant.tree} sprite={props.sprite} />
                </Box>
              ))}
            </Stack>
          </Collapse>
          <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
            <Button size="small" onClick={() => setOpen(!open)}>
              <FormattedMessage
                id={open ? "recipes.hideVariants" : "recipes.showVariants"}
                values={{ count: others.length }}
              />
            </Button>
          </Stack>
        </>
      ) : null}
    </Card>
  );
}

export function LoopList(props: {
  groups: LoopGroup[];
  sprite: Sprite;
  note: string;
}) {
  return (
    <Stack spacing={2}>
      {props.groups.map((group, at) => (
        <LoopCard key={at} group={group} sprite={props.sprite} />
      ))}
      <Typography variant="caption" color="text.secondary">
        {props.note}
      </Typography>
    </Stack>
  );
}
