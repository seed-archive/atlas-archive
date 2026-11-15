import { consoleLoggingIntegration } from "@sentry/core";
import {
  captureRouterTransitionStart,
  feedbackIntegration,
  init,
  replayIntegration,
} from "@sentry/nextjs";

// Sentry runs on the production deploy alone, never locally or on a preview (the
// owner, 2026-11-15; ../.claude/rules/architecture.md, "Sentry: production only").
const dsn =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? process.env.NEXT_PUBLIC_SENTRY_DSN
    : undefined;

if (dsn) {
  init({
    dsn,
    integrations: [
      replayIntegration(),
      feedbackIntegration({ colorScheme: "system" }),
      consoleLoggingIntegration(),
    ],
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    debug: false,
  });
}

export const onRouterTransitionStart = captureRouterTransitionStart;
