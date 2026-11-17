import type { NestedMessages } from "@seed-archive/ui/localization";

import en from "./en.json";

// English only for now: ru.json waits here, and importing it would put it in
// every client bundle.
export enum EnabledLanguages {
  EN = "EN",
}

export const i18n: Record<EnabledLanguages, NestedMessages> = {
  [EnabledLanguages.EN]: en,
};
