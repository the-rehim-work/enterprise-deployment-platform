# Deployment Engineering Insights

## Platform Overview
Enterprise gaming platform (Steam-style) deployed with production-grade CI/CD, monitoring, and security hardening. Built with Next.js 16, TypeScript, Prisma/SQLite, deployed on Vercel.

## Environment Strategy
Three-tier environment setup: development, staging (preview deploys), and production. Environment variables validated at startup using Zod — the application fails fast if configuration is invalid rather than failing silently at runtime.

SQLite was chosen for simplicity. In a real enterprise gaming platform this would be PostgreSQL with read replicas. SQLite works here because the focus is deployment architecture, not database scaling.

## CI/CD Architecture
GitHub Actions handles quality gates on every push to dev and main: ESLint linting, TypeScript strict type checking, production build verification, and dependency security audits. A separate security workflow runs weekly on a cron schedule to catch newly disclosed vulnerabilities.

Vercel handles deployment automatically on push. Branch preview deployments give stakeholders a live URL for every feature branch. No manual deploy steps exist — push to main and production updates.

## Security Hardening
httpOnly cookies over localStorage for JWT storage prevents XSS from stealing tokens. Rate limiting on auth routes uses a simple in-memory store at 20 requests per 15 minutes per IP — not distributed, would need Redis in a multi-instance setup. Security headers are applied both through middleware and Vercel configuration as defense-in-depth. Audit logging captures every auth event and admin action to the database for incident investigation. CSP headers restrict where scripts and styles can load from.

## Performance Monitoring
Web Vitals (CLS, INP, LCP, FCP, TTFB) are tracked client-side and logged. Next.js instrumentation hook handles server-side startup metrics in production. Lighthouse CI is configured for automated performance regression detection in the pipeline. Bundle analyzer is available for identifying oversized dependencies.

## Docker Strategy
The Dockerfile uses a multi-stage build: deps stage installs production dependencies only, builder stage creates the Next.js standalone output, runner stage copies only the built output into a minimal Alpine image. This produces a ~150MB image instead of a 1GB+ development image.

## Trade-offs
Rate limiting is in-memory and resets on server restart. SQLite is single-file with no concurrent write scaling. Lighthouse CI runs against the login page only. No real APM integration (Datadog, Sentry) exists — just logging hooks ready for connection. No load testing setup is included. These are acceptable for a deployment architecture demonstration. A production gaming platform serving real users would need every one of these gaps addressed.

## Key Takeaways
Environment validation at startup prevents entire categories of production incidents. CI quality gates catch issues before they reach production and are worth investing in early. Security is layers — headers, cookies, rate limiting, and audit logs working together. Docker standalone builds dramatically reduce image size for Next.js. Preview deployments change how teams review work by giving every branch a live URL.