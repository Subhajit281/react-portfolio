# Subhajit Sarkar — Developer Portfolio & Visitor Analytics System

A dynamic, high-performance portfolio built with **React 19**, **Vite**, **Tailwind CSS v4**, **Framer Motion**, and **Vercel Serverless Functions**.

The project features an internal, production-grade **Portfolio Visitor Analytics / View Tracking System** powered by **MongoDB** that operates completely in the background without public analytics dashboards or client-side metric exposure.

---

## Table of Contents
1. [System Architecture](#1-system-architecture)
2. [MongoDB Setup & Initialization](#2-mongodb-setup--initialization)
3. [Database Models & Schemas](#3-database-models--schemas)
4. [Database Indexes & Performance](#4-database-indexes--performance)
5. [Environment Variables](#5-environment-variables)
6. [Server-Side Geolocation Provider](#6-server-side-geolocation-provider)
7. [Visitor Identification & Identity Lifecycle](#7-visitor-identification--identity-lifecycle)
8. [View Counting & Refresh Protection](#8-view-counting--refresh-protection)
9. [Session Timeout & Returning Visits](#9-session-timeout--returning-visits)
10. [Heartbeat & Engagement Measurement](#10-heartbeat--engagement-measurement)
11. [Page Visibility & Active Time Tracking](#11-page-visibility--active-time-tracking)
12. [Bot & Crawler Filtering](#12-bot--crawler-filtering)
13. [Analytics API Reference](#13-analytics-api-reference)
14. [Direct Database Inspection (No Frontend UI)](#14-direct-database-inspection-no-frontend-ui)
15. [Privacy Notice & Transparency UI](#15-privacy-notice--transparency-ui)
16. [Consent Configuration & Opt-Out](#16-consent-configuration--opt-out)
17. [Privacy Policy & Legal Alignment](#17-privacy-policy--legal-alignment)
18. [Data Retention & Automated TTL Indexes](#18-data-retention--automated-ttl-indexes)
19. [Data Deletion & Portability (GDPR Requests)](#19-data-deletion--portability-gdpr-requests)
20. [Security & Rate Limiting](#20-security--rate-limiting)
21. [Local Development Guide](#21-local-development-guide)
22. [Production Deployment (Vercel)](#22-production-deployment-vercel)
23. [Third-Party Data Processing](#23-third-party-data-processing)
24. [Verification & Automated Test Suite](#24-verification--automated-test-suite)
25. [Legal Disclaimer & Ownership Notice](#25-legal-disclaimer--ownership-notice)

---

## 1. System Architecture

```
Visitor Browser
      │
      ▼
React 19 Frontend (Vite)
  ├── Anonymous Visitor UUID (localStorage: portfolio_visitor_id)
  ├── Session Lifecycle Manager (30-min inactivity timeout)
  ├── Page Visibility & Heartbeat (~25s interval)
  ├── Pagehide / sendBeacon Exit Dispatcher
  └── Privacy Notice & Consent Modal
      │
      ▼ HTTP POST (/api/analytics/session/*)
Vercel Serverless Functions / Node Dev Server
  ├── Authoritative IP Extraction (x-forwarded-for / socket, spoof-proof)
  ├── Bot / Crawler Detection (filters automated scrapers)
  ├── Server-Side Geolocation (cached in-memory, 4s timeout)
  ├── Device / OS / Browser Parser (zero external dependencies)
  ├── Rate Limiter (token bucket sliding window)
  └── Fail-Safe Fallback (never crashes portfolio if DB is offline)
      │
      ▼ Mongoose Connection Pool
MongoDB Database (Atlas / Self-Hosted)
  ├── visitors Collection (unique visitors, total views, timestamps)
  └── sessions Collection (visit records, geo, device, duration, TTL index)
```

The system operates **asynchronously in the background**. The frontend does not query or display analytics metrics. All administrative queries and traffic analysis are conducted directly through MongoDB Compass, MongoDB Shell, or Atlas.

---

## 2. MongoDB Setup & Initialization

1. Create a free or dedicated cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) (or run a local MongoDB instance).
2. Create a database (e.g. `portfolio_analytics`).
3. Obtain your connection URI:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/portfolio_analytics?retryWrites=true&w=majority
   ```
4. Assign this connection string to the `MONGODB_URI` environment variable.
5. Collections (`visitors` and `sessions`) and all indexes are created automatically on first connection by Mongoose.

---

## 3. Database Models & Schemas

Documents are stored with native BSON `Date` objects for clear date arithmetic and indexing:

### `visitors` Collection
```json
{
  "_id": "ObjectId('6701a2b3c4d5e6f7a8b9c0d1')",
  "visitorId": "3f9c6d48-83b1-419b-a320-ff17208d19a2",
  "firstSeenAt": "2026-10-02T10:15:00.000Z",
  "lastSeenAt": "2026-10-02T10:35:20.000Z",
  "totalVisits": 3,
  "totalViews": 5,
  "lastIp": "203.0.113.195",
  "createdAt": "2026-10-02T10:15:00.000Z",
  "updatedAt": "2026-10-02T10:35:20.000Z"
}
```

### `sessions` Collection
```json
{
  "_id": "ObjectId('6701a2b3c4d5e6f7a8b9c0d2')",
  "sessionId": "b4e883df-59c4-42b3-96b0-137a89f92d47",
  "visitorId": "3f9c6d48-83b1-419b-a320-ff17208d19a2",
  "ipAddress": "203.0.113.195",
  "geo": {
    "country": "India",
    "countryCode": "IN",
    "region": "Assam",
    "city": "Silchar",
    "latitude": 24.8333,
    "longitude": 92.7789,
    "timezone": "Asia/Kolkata",
    "isp": "National Informatics Centre"
  },
  "device": {
    "type": "desktop",
    "browser": "Chrome",
    "browserVersion": "124.0",
    "os": "Windows",
    "osVersion": "10/11"
  },
  "userAgent": {
    "raw": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."
  },
  "referrer": "https://github.com/Subhajit281",
  "landingPage": "/",
  "startedAt": "2026-10-02T10:15:00.000Z",
  "lastSeenAt": "2026-10-02T10:19:30.000Z",
  "endedAt": "2026-10-02T10:19:30.000Z",
  "durationSeconds": 270,
  "isBot": false,
  "expireAt": "2026-12-31T10:15:00.000Z",
  "createdAt": "2026-10-02T10:15:00.000Z",
  "updatedAt": "2026-10-02T10:19:30.000Z"
}
```

---

## 4. Database Indexes & Performance

1. **`visitors`**:
   - `visitorId`: Unique index for instant O(1) visitor identification.
   - `firstSeenAt` / `lastSeenAt`: Indexes for timeline filtering.
2. **`sessions`**:
   - `sessionId`: Unique index ensuring no duplicate session records.
   - `visitorId`: Index for grouping visits per visitor.
   - `startedAt`: Index for time-range filtering and sorting.
   - `geo.country` / `geo.region` / `geo.city`: Indexes for geographical aggregation queries.
   - `expireAt`: **TTL Index (`expireAfterSeconds: 0`)** for automatic data expiration.
   - Compound index: `{ visitorId: 1, startedAt: -1 }`.

---

## 5. Environment Variables

Create `.env` in the root directory (or configure under Vercel Project Settings):

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `MONGODB_URI` | *(Required)* | MongoDB connection URI string |
| `GEOLOCATION_API_URL` | `http://ip-api.com/json/{ip}...` | IP Geolocation lookup URL template |
| `GEOLOCATION_API_KEY` | `""` | Optional API key for commercial geolocation providers |
| `ANALYTICS_GEOLOCATION_ENABLED`| `true` | Enable/disable external IP geolocation |
| `ANALYTICS_ENABLED` | `true` | Master analytics toggle |
| `ANALYTICS_REQUIRE_CONSENT` | `false` | If `true`, requires prior consent before tracking starts |
| `VITE_ANALYTICS_REQUIRE_CONSENT`| `false` | Frontend client-side consent mirror |
| `ANALYTICS_SESSION_TIMEOUT_MINUTES` | `30` | Inactivity window before returning visitor starts new session |
| `ANALYTICS_HEARTBEAT_INTERVAL_SECONDS`| `30` | Interval between active session heartbeats |
| `ANALYTICS_RETENTION_DAYS` | `90` | MongoDB TTL retention period for session documents |
| `ANALYTICS_RAW_IP_RETENTION_DAYS` | `30` | Retention window before raw IP redaction |
| `ANALYTICS_STORE_RAW_IP` | `true` | Whether to persist client IP or only store derived geo |
| `ADMIN_AUTH_SECRET` | *(Required for admin)* | Secret key for administrative and GDPR erasure endpoints |

---

## 6. Server-Side Geolocation Provider

- IP geolocation runs **strictly on the backend**. The browser is **never** asked for GPS permissions.
- **Fail-safe**: If the geolocation provider times out (4-second abort limit) or encounters an error, the session is still safely recorded with `country: "Unknown"`.
- **Local Network Handling**: Localhost (`127.0.0.1`, `::1`) and RFC 1918 private IPs are immediately marked as `"Local Development"` without triggering outbound network requests.
- **Memory Caching**: Resolved coordinates and locations are cached in-memory for 24 hours to prevent repeated external API requests for the same IP.
- Location data is labeled as **"Approximate location based on IP geolocation"**.

---

## 7. Visitor Identification & Identity Lifecycle

- An opaque, random UUID v4 is generated client-side and saved in `localStorage.portfolio_visitor_id`.
- Contains **no personal identifiers** (no email, name, or hardware fingerprints).
- Recognizes returning visitors across different sessions:
  - Day 1: `visitorId: abc123`, `IP: 203.0.113.1` → Visitor 1, Session 1
  - Day 2: `visitorId: abc123`, `IP: 198.51.100.2` → Visitor 1, Session 2 (returning visitor)
- If the visitor clears site data or uses an incognito window, a new anonymous visitor identifier is issued.

---

## 8. View Counting & Refresh Protection

**A page refresh does NOT create duplicate views.**
1. When the visitor loads the portfolio, a `sessionId` is assigned.
2. The frontend sends `POST /api/analytics/session/start`.
3. The backend checks `Session.findOne({ sessionId })`:
   - If **new**: increments visitor's `totalViews` and `totalVisits`, creates a new session.
   - If **already exists** (Page Refresh / Fast Reload): updates `lastSeenAt` and returns `{ isRefresh: true }`.
4. Refreshing the browser 10 times in a row results in exactly **1 view** and **1 session**.

---

## 9. Session Timeout & Returning Visits

- Configurable via `ANALYTICS_SESSION_TIMEOUT_MINUTES` (default: 30 minutes).
- Active timestamps are tracked in `localStorage.portfolio_last_active`.
- If the visitor returns within 30 minutes, the existing session is preserved.
- If the visitor returns after 30+ minutes of inactivity, a fresh `sessionId` is created, recording a new visit while recognizing the same anonymous `visitorId`.

---

## 10. Heartbeat & Engagement Measurement

- The frontend transmits a lightweight heartbeat payload every ~25 seconds:
  ```json
  { "sessionId": "...", "visitorId": "...", "activeDurationSeconds": 75 }
  ```
- **Heartbeats do NOT increment view counts or create sessions.** They update `lastSeenAt` and `durationSeconds` on the existing session.
- Heartbeats are throttled and rate-limited to prevent abuse.

---

## 11. Page Visibility & Active Time Tracking

- Leverages `document.visibilitychange`.
- When the visitor switches to another tab or minimizes the browser, active time accumulation is **paused**, and an interim heartbeat is dispatched.
- When the visitor returns to the tab, tracking resumes seamlessly.
- When the page is closed or navigated away, `pagehide` triggers a final exit update via `navigator.sendBeacon` or fetch with `keepalive: true`.

---

## 12. Bot & Crawler Filtering

- Standard search engine crawlers (Googlebot, Bingbot, Yandex, DuckDuckBot, Baiduspider) and automated tools (curl, wget, python-requests, HeadlessChrome, Lighthouse) are identified server-side via User-Agent inspection.
- When a bot is detected, the endpoint returns `{ ok: true, ignored: true, reason: 'bot' }` without creating a human visitor view or session in MongoDB.
- Legitimate unknown human browsers are **never** blocked.

---

## 13. Analytics API Reference

| Endpoint | Method | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/analytics/session/start` | `POST` | Public (Rate-limited) | Start session or register refresh |
| `/api/analytics/session/heartbeat` | `POST` | Public (Throttled) | Periodic active duration heartbeat |
| `/api/analytics/session/end` | `POST` | Public (Beacon) | Finalize session on tab close |
| `/api/analytics/manage` | `POST/GET` | Admin Secret Only | Status, retention check, GDPR erasure |

*All public endpoints sanitize input, determine client IP on the server, and return minimal JSON responses.*

---

## 14. Direct Database Inspection (No Frontend UI)

As requested, the portfolio **does not include any public or admin frontend analytics dashboards**. You analyze traffic directly in MongoDB:

### Common Useful MongoDB Queries:

**Total Views & Unique Visitors:**
```javascript
// Unique Visitors
db.visitors.countDocuments();

// Total Portfolio Views
db.visitors.aggregate([
  { $group: { _id: null, totalViews: { $sum: "$totalViews" } } }
]);
```

**Top 10 Countries:**
```javascript
db.sessions.aggregate([
  { $match: { isBot: false, "geo.country": { $ne: "Unknown" } } },
  { $group: { _id: "$geo.country", visits: { $sum: 1 } } },
  { $sort: { visits: -1 } },
  { $limit: 10 }
]);
```

**Top Cities in India:**
```javascript
db.sessions.aggregate([
  { $match: { "geo.country": "India" } },
  { $group: { _id: "$geo.city", visits: { $sum: 1 } } },
  { $sort: { visits: -1 } },
  { $limit: 10 }
]);
```

**Average Session Duration (Minutes):**
```javascript
db.sessions.aggregate([
  { $match: { durationSeconds: { $gt: 5 } } },
  { $group: { _id: null, avgDurationSec: { $avg: "$durationSeconds" } } },
  { $project: { avgMinutes: { $divide: ["$avgDurationSec", 60] } } }
]);
```

**Recent Visitors Timeline:**
```javascript
db.sessions.find(
  { isBot: false },
  { sessionId: 1, startedAt: 1, "geo.country": 1, "geo.city": 1, "device.type": 1, "device.browser": 1, durationSeconds: 1 }
).sort({ startedAt: -1 }).limit(25);
```

---

## 15. Privacy Notice & Transparency UI

- Mounted in `src/components/PrivacyNotice.jsx`.
- Floats subtly at the bottom of the viewport with the portfolio's cyberpunk obsidian & neon cyan aesthetic.
- Informs visitors that the site collects anonymous IP-derived location, device type, and visit duration.
- Provides immediate **"Accept"**, **"Decline"**, and **"Settings"** buttons, as well as a direct link to the Privacy Policy.

---

## 16. Consent Configuration & Opt-Out

- Setting `ANALYTICS_REQUIRE_CONSENT=true` (and `VITE_ANALYTICS_REQUIRE_CONSENT=true`) stops tracking until the visitor clicks "Accept".
- Setting to `false` operates on transparent notice with immediate opt-out capability.
- Visitors can toggle their preference anytime via the **Privacy Settings Modal** (accessible from the Privacy Notice or the footer link).
- Opting out immediately ceases tracking, clears active timers, and stops all future heartbeats.

---

## 17. Privacy Policy & Legal Alignment

- Fully updated in `src/components/PrivacyPolicy.jsx`.
- Details data collection categories, purposes, approximate geolocation, third-party provider usage, cookie/storage lifetimes, and data subject rights.
- Explicitly states that IP-derived locations are approximate and never derived from device GPS.

---

## 18. Data Retention & Automated TTL Indexes

- The `sessions` collection defines a native MongoDB TTL index on the `expireAt` field:
  ```javascript
  SessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
  ```
- Every session document calculates `expireAt = Date.now() + (ANALYTICS_RETENTION_DAYS * 86400 * 1000)`.
- When the expiration timestamp is reached, MongoDB's background cleanup process automatically purges the expired records without requiring manual cron jobs.

---

## 19. Data Deletion & Portability (GDPR Requests)

Authenticated administrative requests to `/api/analytics/manage`:

### 1. Delete Visitor Records (Right to Erasure)
```bash
curl -X POST https://subhajit-sarkar.vercel.app/api/analytics/manage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_AUTH_SECRET>" \
  -d '{"action": "delete-visitor", "visitorId": "<TARGET_VISITOR_ID>"}'
```

### 2. Export Visitor Records (Data Portability)
```bash
curl -X POST https://subhajit-sarkar.vercel.app/api/analytics/manage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_AUTH_SECRET>" \
  -d '{"action": "export-visitor", "visitorId": "<TARGET_VISITOR_ID>"}'
```

### 3. Redact Raw IPs Older than 30 Days
```bash
curl -X POST https://subhajit-sarkar.vercel.app/api/analytics/manage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_AUTH_SECRET>" \
  -d '{"action": "redact-old-ips"}'
```

---

## 20. Security & Rate Limiting

- **No Raw IP Leakage**: Raw IP addresses are never sent to the client, never written to cookies/localStorage, and never logged in plaintext client-side errors.
- **Client IP Determination**: Determined strictly server-side using trusted reverse proxy headers (`x-forwarded-for`, `x-real-ip`). Client body IP parameters are completely ignored.
- **In-Memory Rate Limiting**: Built-in token bucket sliding window protects session start, heartbeat, and management endpoints against spam and denial-of-service attempts.
- **Fail-Safe Design**: If MongoDB or geolocation services become unreachable, the portfolio continues to function 100% normally without visible errors.

---

## 21. Local Development Guide

1. Clone repository and install dependencies:
   ```bash
   git clone https://github.com/Subhajit281/react-portfolio.git
   cd react-portfolio
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your `MONGODB_URI`:
   ```bash
   cp .env.example .env
   ```

3. Start the local API server and Vite frontend:
   - **Terminal 1** (Backend Dev Proxy):
     ```bash
     node api/dev-server.js
     ```
   - **Terminal 2** (Vite Dev Server):
     ```bash
     npm run dev
     ```

4. Open `http://localhost:5173`. Vite automatically proxies `/api/*` requests to the local Node server running at `http://localhost:3001`.

---

## 22. Production Deployment (Vercel)

1. Push your changes to GitHub (`main` branch).
2. In the [Vercel Dashboard](https://vercel.com/):
   - Select your project → **Settings** → **Environment Variables**.
   - Add:
     - `MONGODB_URI`: Your production MongoDB Atlas connection string.
     - `ADMIN_AUTH_SECRET`: Strong secret key for administrative tasks.
     - (Optional) `GEOLOCATION_API_URL`, `ANALYTICS_RETENTION_DAYS`, etc.
3. Redeploy. Vercel automatically deploys the serverless functions in the `api/` directory with zero additional configuration needed.

---

## 23. Third-Party Data Processing

| Service | Data Transmitted | Purpose | Privacy Policy |
| :--- | :--- | :--- | :--- |
| **ip-api.com** | Visitor Public IP | Approximate city & country resolution | [ip-api.com/docs/legal](https://ip-api.com/docs/legal) |
| **MongoDB Atlas** | Anonymized analytics records | Secure cloud persistence | [mongodb.com/legal/privacy](https://www.mongodb.com/legal/privacy-policy) |
| **Vercel** | Standard HTTP request logs | Serverless edge hosting | [vercel.com/legal/privacy](https://vercel.com/legal/privacy-policy) |

---

## 24. Verification & Automated Test Suite

Run the built-in analytics verification test suite:
```bash
npm test
```

Expected output:
```
=== RUNNING PORTFOLIO ANALYTICS VERIFICATION SUITE ===
1. IP Resolution & Private Range Detection
  ✓ PASS: Extracts leftmost client IP from x-forwarded-for and ignores body IP
  ✓ PASS: Identifies 127.0.0.1 as private IP
  ✓ PASS: Identifies ::1 as private IP
  ✓ PASS: Anonymizes IPv4 address correctly
2. Bot & Automated Crawler Filtering
  ✓ PASS: Filters Googlebot / Bingbot / crawlers
3. Device, Browser & OS Parsing
  ✓ PASS: Identifies desktop, mobile, Chrome, Safari, Windows, iOS
4. Server-Side IP Geolocation & Resilience
  ✓ PASS: Resolves local IP without outbound network calls
5. API Endpoints & Graceful Degradation (Fail-Safe)
  ✓ PASS: Session start returns 200 under database fallback
6. Administrative Security & Protection
  ✓ PASS: Rejects unauthorized access to management endpoint
  ✓ PASS: Rate limiter engages after threshold exceeded

TOTAL TESTS: 30 | PASSED: 30 | FAILED: 0
```

Verify frontend build and linting:
```bash
npm run lint
npm run build
```

---

## 25. Legal Disclaimer & Ownership Notice

The technical controls, retention defaults (90 days for sessions, 30 days for raw IP), and consent mechanisms implemented in this codebase represent **technical defaults** designed for privacy consciousness. They do not constitute formal legal counsel or an automated guarantee of compliance with GDPR, CCPA, DPDP Act, or any specific national legislation.

The website owner is responsible for reviewing applicable regional legal obligations, maintaining accurate disclosures, and obtaining independent legal advice where required.
