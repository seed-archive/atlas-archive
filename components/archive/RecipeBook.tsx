"use client";

import { useMemo, useState } from "react";
import { Controller, useForm, useWatch, type Control } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

import { Article } from "@/components/archive/Article";
import {
  SLOTS,
  type Book,
  type Item,
  type Part,
  type RecipeRow,
} from "@/lib/archive/recipes";
import { RecipeTree, type TreeNode } from "@/components/archive/RecipeTree";
import { SlotTile } from "@/components/archive/SlotTile";

// The sprite's tiles sit in rows of 16 (`recipes_emit.py`).
const SPRITE_COLUMNS = 16;
// How many recipes a card lists under each head before it says how many more.
const CARD_ROWS = 12;
// The refiner a recipe needs, by its count of ingredients: the Portable takes one,
// the Medium two, the Large three (the owner, 2026-11-08).
const REFINERS = ["", "recipes.portable", "recipes.medium", "recipes.large"];

// `size`: how many slots the refiner picked has, the Large's three by default;
// `expeditions`: whether the crafts only an expedition teaches are shown.
type Filter = {
  slots: (string | null)[];
  result: string | null;
  size: number;
  expeditions: boolean;
};

const EMPTY: Filter = {
  slots: [null, null, null],
  result: null,
  size: SLOTS,
  expeditions: false,
};

function Tile(props: { tile: number | null; sprite: string }) {
  return (
    <SlotTile
      tile={props.tile}
      sprite={{ src: props.sprite, columns: SPRITE_COLUMNS }}
    />
  );
}

// An item of a recipe: its picture, name, and count, opening its card.
function PartButton(props: {
  part: Part;
  book: Book;
  onOpen: (id: string) => void;
}) {
  const [id, amount] = props.part;
  const item = props.book.items[id];
  return (
    <ButtonBase
      onClick={() => props.onOpen(id)}
      sx={{
        borderRadius: 1,
        px: 0.5,
        py: 0.25,
        justifyContent: "flex-start",
        textAlign: "left",
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Tile tile={item.tile} sprite={props.book.sprite} />
        <Typography variant="body2">
          {amount > 1 ? `${amount} × ` : ""}
          {item.name}
        </Typography>
      </Stack>
    </ButtonBase>
  );
}

// The expedition a craft's blueprint comes from, a grey line under its name.
function ExpeditionNote(props: { expedition: number | null }) {
  return props.expedition === null ? null : (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ display: "block", pl: 0.5 }}
    >
      <FormattedMessage
        id="recipes.expedition"
        values={{ number: props.expedition }}
      />
    </Typography>
  );
}

// Recipes as a table: the result first, its ingredients under one another.
// The page's list and an item's card both draw it, so their columns line up the
// same way.
function RecipeRows(props: {
  rows: RecipeRow[];
  book: Book;
  onOpen: (id: string) => void;
}) {
  const { book } = props;
  return (
    <TableContainer component={Card} variant="outlined">
      <Table size="small" sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage id="recipes.result" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="recipes.ingredients" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, index) => (
            <TableRow key={index} sx={{ verticalAlign: "top" }}>
              <TableCell>
                <PartButton
                  part={[row[0], row[1]]}
                  book={book}
                  onOpen={props.onOpen}
                />
                <ExpeditionNote expedition={row[4]} />
              </TableCell>
              <TableCell>
                <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
                  {row[2].map((part, at) => (
                    <PartButton
                      key={at}
                      part={part}
                      book={book}
                      onOpen={props.onOpen}
                    />
                  ))}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Whether a recipe fits the refiner picked, is shown by the expedition switch,
// holds every ingredient picked, each as often as picked, and gives the result
// picked.
function matches(row: RecipeRow, filter: Filter) {
  if (row[2].length > filter.size) {
    return false;
  }
  if (!filter.expeditions && row[4] !== null) {
    return false;
  }
  if (filter.result && row[0] !== filter.result) {
    return false;
  }
  const left = row[2].map((part) => part[0]);
  for (const id of filter.slots) {
    if (!id) {
      continue;
    }
    const at = left.indexOf(id);
    if (at < 0) {
      return false;
    }
    left.splice(at, 1);
  }
  return true;
}

function ItemField(props: {
  name: `slots.${number}` | "result";
  label: string;
  options: string[];
  book: Book;
  control: Control<Filter>;
  disabled?: boolean;
}) {
  const { book } = props;
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field }) => (
        <Autocomplete
          disabled={props.disabled}
          options={props.options}
          value={field.value ?? null}
          onChange={(_, value) => field.onChange(value)}
          getOptionLabel={(id) => book.items[id]?.name ?? id}
          renderOption={({ key, ...rest }, id) => (
            <Box component="li" key={key} {...rest}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Tile
                  tile={book.items[id].tile}

                  sprite={book.sprite}
                />
                <span>{book.items[id].name}</span>
              </Stack>
            </Box>
          )}
          renderInput={(params) => (
            <TextField {...params} label={props.label} size="small" />
          )}
          sx={{ flex: "1 1 200px", minWidth: 180 }}
        />
      )}
    />
  );
}

// How deep an assembly tree goes before it stops: our own choice, deeper than any
// chain of one station the game's tables hold.
const TREE_DEPTH = 5;

// An item's assembly steps, as the game draws them: the item on top, the
// ingredients of its first recipe under it, each of them made the same way, down
// to what no recipe of this station makes. `amount` is how many are needed; a
// step makes whole batches. An item already on the path stops there, so a loop
// draws once.
function assembly(
  book: Book,
  id: string,
  amount: number,
  path: string[],
): TreeNode {
  const item = book.items[id];
  const recipe =
    path.length < TREE_DEPTH && !path.includes(id)
      ? book.rows.find((row) => row[0] === id)
      : undefined;
  const batches = recipe ? Math.ceil(amount / recipe[1]) : 0;
  return {
    item: [item.name, amount, item.tile],
    parts: recipe
      ? recipe[2].map(([part, count]) =>
          assembly(book, part, count * batches, [...path, id]),
        )
      : [],
  };
}

function ItemCard(props: {
  id: string;
  book: Book;
  onOpen: (id: string) => void;
  onClose: () => void;
  onFilter: (filter: Filter) => void;
}) {
  const { id, book } = props;
  const item: Item = book.items[id];
  const made = book.rows.filter((row) => row[0] === id);
  const used = book.rows.filter((row) => row[2].some((part) => part[0] === id));
  const list = (rows: RecipeRow[]) => (
    <Stack spacing={0.5}>
      <RecipeRows
        rows={rows.slice(0, CARD_ROWS)}
        book={book}
        onOpen={props.onOpen}
      />
      {rows.length > CARD_ROWS ? (
        <Typography variant="body2" color="text.secondary">
          <FormattedMessage
            id="recipes.more"
            values={{ count: rows.length - CARD_ROWS }}
          />
        </Typography>
      ) : null}
    </Stack>
  );
  return (
    <Dialog open onClose={props.onClose} fullWidth maxWidth="sm" scroll="body">
      <DialogTitle>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Tile tile={item.tile} sprite={book.sprite} />
          <Box>
            <Typography variant="h6" component="span">
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.subtitle}
            </Typography>
            <ExpeditionNote expedition={made[0]?.[4] ?? null} />
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body2">{item.description}</Typography>
          <Typography variant="body2">
            <FormattedMessage
              id="recipes.value"
              values={{ value: item.value.toLocaleString("en") }}
            />
          </Typography>
          {item.food ? (
            <Typography variant="body2">
              <FormattedMessage
                id="recipes.food"
                values={{
                  stat: item.food.stat,
                  bonus: item.food.bonus,
                  minutes: Math.round(item.food.seconds / 60),
                }}
              />
            </Typography>
          ) : null}
          {made.length ? (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                <FormattedMessage id="recipes.assembly" />
              </Typography>
              <RecipeTree
                tree={assembly(book, id, made[0][1], [])}
                sprite={{ src: book.sprite, columns: SPRITE_COLUMNS }}
              />
              <Typography variant="subtitle2" gutterBottom>
                <FormattedMessage id="recipes.madeFrom" />
              </Typography>
              {list(made)}
              <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  onClick={() => props.onFilter({ ...EMPTY, result: id })}
                >
                  <FormattedMessage id="recipes.showMade" />
                </Button>
              </Stack>
            </Box>
          ) : null}
          {used.length ? (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                <FormattedMessage id="recipes.usedIn" />
              </Typography>
              {list(used)}
              <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  onClick={() =>
                    props.onFilter({ ...EMPTY, slots: [id, null, null] })
                  }
                >
                  <FormattedMessage id="recipes.showUsed" />
                </Button>
              </Stack>
            </Box>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          <FormattedMessage id="recipes.close" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function RecipeTable(props: {
  book: Book;
  control: Control<Filter>;
  onOpen: (id: string) => void;
}) {
  const { book } = props;
  const filter = useWatch({ control: props.control }) as Filter;
  const shown = useMemo(
    () => book.rows.filter((row) => matches(row, filter)),
    [book.rows, filter],
  );
  return (
    <Stack spacing={1}>
      <Typography variant="body2" color="text.secondary">
        <FormattedMessage id="recipes.count" values={{ count: shown.length }} />
      </Typography>
      <RecipeRows rows={shown} book={book} onOpen={props.onOpen} />
    </Stack>
  );
}

export function RecipeBook(props: { html: string; book: Book }) {
  return (
    <Article
      html={props.html}
      widgets={{ book: () => <Finder book={props.book} /> }}
    />
  );
}

// The filter, the table, and the card: one component, so the form keeps its
// fields while a card opens and closes.
function Finder(props: { book: Book }) {
  const { book } = props;
  const intl = useIntl();
  const { control, reset, setValue } = useForm<Filter>({
    defaultValues: EMPTY,
  });
  const [open, setOpen] = useState<string | null>(null);
  const refiner = book.station === "refiner";
  const expeditionCount = book.rows.filter((row) => row[4] !== null).length;
  const hasExpeditions = expeditionCount > 0;
  const size = useWatch({ control, name: "size" });
  const slots = useWatch({ control, name: "slots" });
  const filled = slots.filter(Boolean).length;
  const byName = (a: string, b: string) =>
    book.items[a].name.localeCompare(book.items[b].name);
  const ingredients = useMemo(
    () =>
      [
        ...new Set(book.rows.flatMap((row) => row[2].map((part) => part[0]))),
      ].sort(byName),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [book],
  );
  const results = useMemo(
    () => [...new Set(book.rows.map((row) => row[0]))].sort(byName),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [book],
  );
  return (
    <>
      <Stack spacing={2}>
        {refiner ? (
          <Controller
            name="size"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                exclusive
                size="small"
                value={field.value}
                onChange={(_, value: number | null) => {
                  if (value === null) {
                    return;
                  }
                  field.onChange(value);
                  // A smaller refiner has no room for the slots past its size.
                  for (let at = value; at < SLOTS; at += 1) {
                    setValue(`slots.${at}`, null);
                  }
                }}
              >
                {[1, 2, 3].map((count) => (
                  <ToggleButton key={count} value={count}>
                    <FormattedMessage id={REFINERS[count]} />
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
          />
        ) : null}
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
          {Array.from({ length: SLOTS }, (_, at) => (
            <ItemField
              key={at}
              name={`slots.${at}`}
              label={intl.formatMessage(
                { id: "recipes.slot" },
                { number: at + 1 },
              )}
              options={ingredients}
              book={book}
              control={control}
              disabled={at >= size}
            />
          ))}
        </Stack>
        {refiner && filled > 0 ? (
          <Typography variant="body2" color="text.secondary">
            <FormattedMessage
              id="recipes.needs"
              values={{
                refiner: intl.formatMessage({ id: REFINERS[filled] }),
              }}
            />
          </Typography>
        ) : null}
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ flexWrap: "wrap", alignItems: "center" }}
        >
          <ItemField
            name="result"
            label={intl.formatMessage({ id: "recipes.wanted" })}
            options={results}
            book={book}
            control={control}
          />
          <Button onClick={() => reset(EMPTY)}>
            <FormattedMessage id="recipes.clear" />
          </Button>
        </Stack>
        {hasExpeditions ? (
          <Controller
            name="expeditions"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                }
                label={
                  <FormattedMessage
                    id="recipes.expeditions"
                    values={{ count: expeditionCount }}
                  />
                }
              />
            )}
          />
        ) : null}
        <RecipeTable book={book} control={control} onOpen={setOpen} />
      </Stack>
      {open ? (
        <ItemCard
          id={open}
          book={book}
          onOpen={setOpen}
          onClose={() => setOpen(null)}
          onFilter={(filter) => {
            // A card's own recipes stay in view, an expedition's too.
            reset({ ...filter, expeditions: hasExpeditions });
            setOpen(null);
          }}
        />
      ) : null}
    </>
  );
}
