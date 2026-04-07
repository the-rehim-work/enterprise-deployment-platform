# Enterprise Reliability Insights

## Debugging Tools Implemented

This project introduces a structured debugging and monitoring layer on top of an existing Steam-style gaming platform. The key additions are: a leveled logger utility that silences verbose output in production while keeping full traces in development, a performance measurement library that tracks execution time and flags slow operations, a client-side error reporting API that collects crashes from real user sessions, and a monitoring dashboard that aggregates everything for admin visibility. Each tool serves a distinct role — the logger standardizes console output format, the perf library catches regressions before users notice, and the error API creates a feedback loop from browser to server.

## Error Boundary Architecture

The error boundary protects the gaming platform at two levels. The component-level `ErrorBoundary` wraps the main content area in the platform layout, catching React rendering failures in the game library, leaderboard, achievements, and dashboard pages. When a component tree crashes — say the game detail view fails to parse API data or the leaderboard table receives unexpected null scores — the boundary isolates the failure, shows a retry option, and reports the error with a unique ID to the backend. This prevents a single broken component from taking down the entire platform session. The global error handler supplements this by catching unhandled promise rejections and window-level errors that escape React's tree, such as failed network requests in background fetches or third-party script failures.

## Performance Monitoring Approach

In a gaming platform, "slow" is context-dependent. API calls to fetch a game catalog should complete under 2 seconds. Rendering a leaderboard table should take under 100ms. Database queries for achievement lookups should stay under 500ms. The performance library uses substring matching on operation names to apply appropriate thresholds, and any operation exceeding its threshold is flagged. The Performance Monitor overlay (available in development or via `?debug=1`) surfaces Web Vitals — LCP, CLS, INP, FCP, TTFB — alongside these custom measurements, giving developers immediate visibility into both platform-level and browser-level performance.

## Global Error Catching

Error boundaries only catch errors during React rendering. JavaScript errors thrown outside the component lifecycle — in event handlers, async callbacks, or third-party integrations — bypass boundaries entirely. The `GlobalErrorHandler` component attaches window-level listeners for both synchronous errors and unhandled promise rejections, forwarding them to the same error reporting API. Together with the error boundary, this creates comprehensive coverage: React tree errors are caught by boundaries, everything else by the global handler.

## Monitoring Dashboard

The `/monitoring` page provides admin users with two views: platform events (audit logs from authentication, game management, and role changes stored in the database) and client errors (crash reports collected from user browsers via the error API). This gives operations visibility into both intentional platform activity and unintentional failures, all in one place.

## Production vs Development

The logger suppresses debug and info levels in production, keeping only warnings and errors. The performance monitor overlay is hidden in production unless explicitly activated with `?debug=1`. The error boundary hides stack traces from end users in production but shows them in development. This layered approach ensures developers get maximum information during development while users see clean, non-technical error states.

## SQLite Limitations

Storing client errors in an in-memory array on the server is adequate for development and demonstration but fundamentally unsuitable for production. Serverless deployments (like Vercel) spin up isolated function instances that don't share memory, so errors reported to one instance are invisible to another. A production system would use Sentry or DataDog for error aggregation, providing persistent storage, deduplication, alerting, source map support, and cross-session correlation. The in-memory approach here demonstrates the reporting pipeline without introducing external service dependencies.
