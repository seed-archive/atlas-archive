-- The starship builder's other hulls ask for a search like the exotic and the solar
-- ship (the owner, 2026-11-20: one tab a hull): the Fighter now, the Dropship, the
-- Scientific, and the Shuttle as their tabs come.
alter table public.search_requests drop constraint search_requests_kind_check;

alter table public.search_requests add constraint search_requests_kind_check check (
  kind in (
    'interceptor',
    'capital-freighter',
    'living-ship',
    'living-frigate',
    'regular-freighter',
    'exotic',
    'sail',
    'fighter',
    'dropship',
    'scientific',
    'shuttle'
  )
);
