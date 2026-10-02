// server/test-analytics.js
// Automated verification suite for the Consolidated Analytics Function (api/analytics.js)

import { getClientIp, isPrivateIp, anonymizeIp } from "./lib/ipUtils.js";
import { isBot } from "./lib/botFilter.js";
import { parseUserAgent } from "./lib/uaParser.js";
import { getIpGeoLocation } from "./lib/geolocation.js";
import { isAllowed } from "./lib/rateLimit.js";
import analyticsGateway from "../api/analytics.js";

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, val) {
      res.headers[key] = val;
    },
    status(code) {
      res.statusCode = code;
      return res;
    },
    json(data) {
      res.body = data;
      return res;
    },
    end() {
      return res;
    },
  };
  return res;
}

async function runTests() {
  console.log("=== RUNNING CONSOLIDATED ANALYTICS FUNCTION VERIFICATION ===\n");

  // 1. IP & Network Detection
  console.log("1. IP Resolution & Anonymization");
  const mockReqWithSpoof = {
    headers: { "x-forwarded-for": "203.0.113.195, 10.0.0.1" },
    body: { ip: "1.2.3.4" },
    socket: { remoteAddress: "127.0.0.1" },
  };
  assert(getClientIp(mockReqWithSpoof) === "203.0.113.195", "Extracts authoritative client IP from proxy headers");
  assert(isPrivateIp("127.0.0.1") === true, "Identifies 127.0.0.1 as private loopback");
  assert(isPrivateIp("192.168.1.1") === true, "Identifies 192.168.x.x as private range");
  assert(isPrivateIp("8.8.8.8") === false, "Identifies 8.8.8.8 as public IP");
  assert(anonymizeIp("203.0.113.195") === "203.0.113.0", "Anonymizes IPv4 address correctly");

  // 2. Bot Filtering
  console.log("\n2. Bot & Automated Crawler Filtering");
  assert(isBot("Mozilla/5.0 (compatible; Googlebot/2.1)") === true, "Filters Googlebot");
  assert(isBot("python-requests/2.28.1") === true, "Filters python-requests scraper");
  assert(isBot("curl/7.68.0") === true, "Filters curl client");
  const normalChromeUA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
  assert(isBot(normalChromeUA) === false, "Allows legitimate Chrome browser");

  // 3. User-Agent Parsing
  console.log("\n3. Device, Browser & OS Parsing");
  const parsed = parseUserAgent(normalChromeUA);
  assert(parsed.type === "desktop", "Identifies desktop device");
  assert(parsed.browser === "Chrome", "Identifies Chrome browser");
  assert(parsed.os === "Windows", "Identifies Windows OS");

  // 4. Geolocation Resilience
  console.log("\n4. Server-Side Geolocation");
  const localGeo = await getIpGeoLocation("127.0.0.1");
  assert(localGeo.country === "Local Development", "Local IP resolved without outbound network request");

  // 5. Consolidated Gateway - Route Dispatching
  console.log("\n5. Consolidated Gateway Action Routing");

  // Test Rewrite: /api/analytics/session/start (endpoint: "session/start")
  const startReqBot = {
    method: "POST",
    headers: { "user-agent": "Googlebot/2.1" },
    query: { endpoint: "session/start" },
    body: { visitorId: "test-v1", sessionId: "test-s1" },
  };
  const startResBot = createMockRes();
  await analyticsGateway(startReqBot, startResBot);
  assert(startResBot.body?.ignored === true, "Gateway filters bot via rewrite route");

  const startReqHuman = {
    method: "POST",
    headers: { "user-agent": normalChromeUA, "x-forwarded-for": "127.0.0.1" },
    query: { endpoint: "session/start" },
    body: { visitorId: "test-human", sessionId: "test-session-suite" },
  };
  const startResHuman = createMockRes();
  await analyticsGateway(startReqHuman, startResHuman);
  assert(startResHuman.statusCode === 200, "Gateway session/start returns 200");
  assert(startResHuman.body?.ok === true, "Gateway session/start returns ok: true");

  // Test Rewrite: /api/analytics/session/heartbeat (endpoint: "session/heartbeat")
  const hbReq = {
    method: "POST",
    headers: {},
    query: { endpoint: "session/heartbeat" },
    body: { visitorId: "test-human", sessionId: "test-session-suite", activeDurationSeconds: 25 },
  };
  const hbRes = createMockRes();
  await analyticsGateway(hbReq, hbRes);
  assert(hbRes.statusCode === 200, "Gateway session/heartbeat returns 200");
  assert(hbRes.body?.ok === true, "Gateway session/heartbeat returns ok: true");

  // Test Rewrite: /api/analytics/session/end (endpoint: "session/end")
  const endReq = {
    method: "POST",
    headers: {},
    query: { endpoint: "session/end" },
    body: JSON.stringify({ visitorId: "test-human", sessionId: "test-session-suite", activeDurationSeconds: 50 }),
  };
  const endRes = createMockRes();
  await analyticsGateway(endReq, endRes);
  assert(endRes.statusCode === 200, "Gateway session/end returns 200");
  assert(endRes.body?.ok === true, "Gateway session/end returns ok: true");

  // Test Direct Action in Body: { action: "heartbeat" }
  const directActionReq = {
    method: "POST",
    headers: {},
    query: {},
    body: { action: "heartbeat", visitorId: "test-human", sessionId: "test-session-suite", activeDurationSeconds: 30 },
  };
  const directActionRes = createMockRes();
  await analyticsGateway(directActionReq, directActionRes);
  assert(directActionRes.statusCode === 200, "Gateway dispatches direct body action: heartbeat");

  // Test Admin Security via Gateway: /api/analytics/manage
  const unauthReq = {
    method: "POST",
    headers: {},
    query: { endpoint: "manage" },
    body: { action: "status" },
  };
  const unauthRes = createMockRes();
  await analyticsGateway(unauthReq, unauthRes);
  assert(unauthRes.statusCode === 401, "Gateway rejects unauthorized management calls");

  // Test Rate Limiter
  let rateLimited = false;
  for (let i = 0; i < 35; i++) {
    if (!isAllowed("gateway-rate-key", 30, 60000)) {
      rateLimited = true;
      break;
    }
  }
  assert(rateLimited === true, "Gateway rate limiter throttles excessive requests");

  console.log(`\n======================================================`);
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});

