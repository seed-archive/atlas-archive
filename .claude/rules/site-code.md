---
paths:
  - "app/**"
  - "components/**"
  - "lib/**"
  - "next.config.ts"
---

# Site code

The stack, the principles, forms, localization and Supabase types follow the archive's `site-code.md`. Here besides:

- This Next.js is newer than most examples: read the guide in `node_modules/next/dist/docs/` before using an API
  (`01-app/01-getting-started` covers server and client components, data, caching, metadata).
- Material UI for every control and layout; theme tokens over literal colours.
- Supabase types (`lib/db/supabase.types.ts`) come from `npm run supabase:generate`, then prettier.

## Data

- Paths of guides are built with `guidePath` and `groupPath`, never typed.
- Statistics numbers print only through `lib/archive/statistics-format.ts`. A galaxy in a table goes through
  `GalaxyLink`; a new galaxy on a page needs a line in `lib/archive/galaxies.ts`.
- Every table of numbers gets a chart, in `lib/archive/statistics-charts.ts`, on the server, from `rawTableOf`, drawn by
  `ChartBlock` of `@seed-archive/ui/chart` with Chart first and the table kept in the HTML. Charts use `@mui/x-charts`, free version. Colours
  live in `lib/archive/chart-colors.ts`, one per thing, on every chart. A chart draws counts on one scale, never two
  shares of different wholes side by side.
- The code keeps the old names (`statistics.json`, `content/en/statistics/`, `StatisticsScreen`); only what a visitor
  reads changed.
- A canvas never reads a weight from alpha: a browser zeroes the colour of a pixel of alpha 0.
