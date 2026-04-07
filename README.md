# Welcome to 09 Troubleshooting
***

## Task
Build an enterprise reliability layer for a Steam-style gaming platform — adding structured error handling, performance monitoring, client error reporting, and an admin monitoring dashboard to an existing Next.js deployment.

## Description
The solution extends the existing gaming platform with a comprehensive debugging and monitoring toolkit. React error boundaries catch and report component-level crashes with unique error IDs and retry logic. A global error handler captures unhandled exceptions and promise rejections at the window level. A performance monitoring overlay displays Web Vitals (LCP, CLS, INP, FCP, TTFB) and custom timing measurements with threshold-based slow detection. A leveled logger utility standardizes console output across the application with production-aware log suppression. A client error reporting API receives crash reports from browsers and stores them for admin review. The monitoring dashboard surfaces both platform audit logs and client errors in a single admin-only view. Custom Next.js error and 404 pages provide Steam-themed fallbacks for unhandled routes and application errors.

## Installation
```bash
git clone <repository-url>
cd enterprise-deployment-platform
npm install
npx prisma db push
npm run db:seed
```

## Usage
```bash
npm run dev
```

Visit `/monitoring` as admin (username: `TheRehim`, password: `rehim123`) to view the monitoring dashboard.

Append `?debug=1` to any URL to activate the performance monitoring panel in production, or it appears automatically in development mode.

### The Core Team

<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
