-- The starship builder's first hull, the exotic, asks for a search like every builder
-- (the owner, 2026-11-20): its kind joins the list.
alter table public.search_requests drop constraint search_requests_kind_check;

alter table public.search_requests add constraint search_requests_kind_check check (
  kind in (
    'interceptor',
    'capital-freighter',
    'living-ship',
    'living-frigate',
    'regular-freighter',
    'exotic'
  )
);
