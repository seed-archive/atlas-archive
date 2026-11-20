"use client";

import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { Article } from "@/components/archive/Article";
import { Builder } from "@/components/archive/builder/Builder";
import type { ShipModule } from "@/lib/archive/builder/ship";
import { DROPSHIP } from "@/lib/archive/dropship-parts";
import { EXOTIC } from "@/lib/archive/exotic-parts";
import { FIGHTER } from "@/lib/archive/fighter-parts";
import { SAIL } from "@/lib/archive/sail-parts";
import { SCIENTIFIC } from "@/lib/archive/scientific-parts";
import { SHUTTLE } from "@/lib/archive/shuttle-parts";

// The hulls of the starships a system offers, one tab each, each built on its own
// tree of parts (the owner, 2026-11-20). The other hulls join as their trees are read.
const HULLS: { id: string; ship: ShipModule }[] = [
  { id: "archive.hullExotic", ship: EXOTIC },
  { id: "archive.hullSail", ship: SAIL },
  { id: "archive.hullFighter", ship: FIGHTER },
  { id: "archive.hullDropship", ship: DROPSHIP },
  { id: "archive.hullScientific", ship: SCIENTIFIC },
  { id: "archive.hullShuttle", ship: SHUTTLE },
];

// The starship builder: a hull switch over the builder core.
function Finder() {
  const [hull, setHull] = useState(0);
  return (
    <Stack spacing={2}>
      <Tabs value={hull} onChange={(_event, value: number) => setHull(value)}>
        {HULLS.map((each) => (
          <Tab key={each.id} label={<FormattedMessage id={each.id} />} />
        ))}
      </Tabs>
      <Builder key={HULLS[hull].ship.kind} ship={HULLS[hull].ship} />
    </Stack>
  );
}

export function StarshipFinder(props: { html: string }) {
  return <Article html={props.html} widgets={{ finder: Finder }} />;
}
