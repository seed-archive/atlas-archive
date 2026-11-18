"use client";

import { PropsWithChildren } from "react";
import { Providers as SharedProviders } from "@seed-archive/ui/providers";

import { ArchiveShell } from "@/components/archive/ArchiveShell";
import { ReactQueryClientProvider } from "@/components/providers/ReactQueryClientProvider";
import { getBrowserSupabase } from "@/lib/db/supabase.browser";
import { EnabledLanguages, i18n } from "@/lib/i18n";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ReactQueryClientProvider>
      <SharedProviders
        i18n={i18n}
        defaultLanguage={EnabledLanguages.EN}
        getSupabase={getBrowserSupabase}
        googleClientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
      >
        <ArchiveShell>{children}</ArchiveShell>
      </SharedProviders>
    </ReactQueryClientProvider>
  );
};
