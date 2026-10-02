// api/test-analytics.js
// Automated verification suite for the Portfolio Visitor Analytics System

import { getClientIp, isPrivateIp, anonymizeIp } from "./lib/ipUtils.js";
import { isBot } from "./lib/botFilter.js";
import { parseUserAgent } from "./lib/uaParser.js";
import { getIpGeoLocation } from "./lib/geolocation.js";
import { isAllowed } from "./lib/rateLimit.js";
import startHandler from "./analytics/session/start.js";
import heartbeatHandler from "./analytics/session/heartbeat.js";
import endHandler from "./analytics/session/end.js";
import manageHandler from "./analytics/manage.js";

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

// Mock HTTP response helper
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
  console.log("=== RUNNING PORTFOLIO ANALYTICS VERIFICATION SUITE ===\n");

  // -------------------------------------------------------------
  // SUITE 1: IP Resolution & Spoofing Prevention
  // -------------------------------------------------------------
  console.log("1. IP Resolution & Private Range Detection");

  const mockReqWithSpoof = {
    headers: { "x-forwarded-for": "203.0.113.195, 10.0.0.1" },
    body: { ip: "1.2.3.4" }, // client tries to submit fake IP
    socket: { remoteAddress: "127.0.0.1" },
  };
  const resolvedIp = getClientIp(mockReqWithSpoof);
  assert(resolvedIp === "203.0.113.195", "Extracts leftmost client IP from x-forwarded-for and ignores body IP");

  assert(isPrivateIp("127.0.0.1") === true, "Identifies 127.0.0.1 as private IP");
  assert(isPrivateIp("::1") === true, "Identifies ::1 as private IP");
  assert(isPrivateIp("192.168.1.50") === true, "Identifies 192.168.x.x as private IP");
  assert(isPrivateIp("10.0.5.1") === true, "Identifies 10.x.x.x as private IP");
  assert(isPrivateIp("8.8.8.8") === false, "Identifies 8.8.8.8 as public IP");
  assert(anonymizeIp("203.0.113.195") === "203.0.113.0", "Anonymizes IPv4 address correctly");

  // -------------------------------------------------------------
  // SUITE 2: Bot & Crawler Detection
  // -------------------------------------------------------------
  console.log("\n2. Bot & Automated Crawler Filtering");

  const googleBotUA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
  const bingBotUA = "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)";
  const pythonUA = "python-requests/2.28.1";
  const curlUA = "curl/7.68.0";
  const normalChromeUA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
  const normaliPhoneUA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";

  assert(isBot(googleBotUA) === true, "Filters Googlebot");
  assert(isBot(bingBotUA) === true, "Filters Bingbot");
  assert(isBot(pythonUA) === true, "Filters python-requests crawler");
  assert(isBot(curlUA) === true, "Filters curl client");
  assert(isBot(normalChromeUA) === false, "Does NOT filter regular desktop Chrome browser");
  assert(isBot(normaliPhoneUA) === false, "Does NOT filter regular mobile Safari browser");

  // -------------------------------------------------------------
  // SUITE 3: User-Agent Parsing
  // -------------------------------------------------------------
  console.log("\n3. Device, Browser & OS Parsing");

  const parsedDesktop = parseUserAgent(normalChromeUA);
  assert(parsedDesktop.type === "desktop", "Identifies desktop device");
  assert(parsedDesktop.browser === "Chrome", "Identifies Chrome browser");
  assert(parsedDesktop.os === "Windows", "Identifies Windows OS");

  const parsedMobile = parseUserAgent(normaliPhoneUA);
  assert(parsedMobile.type === "mobile", "Identifies mobile device");
  assert(parsedMobile.browser === "Safari", "Identifies Safari browser");
  assert(parsedMobile.os === "iOS", "Identifies iOS");

  // -------------------------------------------------------------
  // SUITE 4: Geolocation Provider & Fallback Handling
  // -------------------------------------------------------------
  console.log("\n4. Server-Side IP Geolocation & Resilience");

  const localGeo = await getIpGeoLocation("127.0.0.1");
  assert(localGeo.country === "Local Development", "Resolves local IP without outbound network calls");
  assert(localGeo.city === "Localhost", "Local IP city marked as Localhost");

  // -------------------------------------------------------------
  // SUITE 5: API Endpoints & Fail-Safe Operation
  // -------------------------------------------------------------
  console.log("\n5. API Endpoints & Graceful Degradation (Fail-Safe)");

  // Test Session Start Bot Filtering
  const botReq = {
    method: "POST",
    headers: {
      "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)",
    },
    body: {
      visitorId: "test-bot-visitor",
      sessionId: "test-bot-session",
    },
  };
  const botRes = createMockRes();
  await startHandler(botReq, botRes);
  assert(botRes.body?.ignored === true, "Session start endpoint ignores bot requests silently");

  // Test Session Start Fallback when DB is offline
  const humanReq = {
    method: "POST",
    headers: {
      "user-agent": normalChromeUA,
      "x-forwarded-for": "127.0.0.1",
    },
    body: {
      visitorId: "test-human-visitor-001",
      sessionId: "test-human-session-001",
      referrer: "https://github.com/Subhajit281",
      landingPage: "/",
    },
  };
  const humanRes = createMockRes();
  await startHandler(humanReq, humanRes);
  assert(humanRes.statusCode === 200, "Session start returns 200 even under database fallback");
  assert(humanRes.body?.ok === true, "Session start returns ok: true");

  // Test Heartbeat
  const hbReq = {
    method: "POST",
    headers: {},
    body: {
      visitorId: "test-human-visitor-001",
      sessionId: "test-human-session-001",
      activeDurationSeconds: 25,
    },
  };
  const hbRes = createMockRes();
  await heartbeatHandler(hbReq, hbRes);
  assert(hbRes.statusCode === 200, "Heartbeat returns 200");
  assert(hbRes.body?.ok === true, "Heartbeat returns ok: true");

  // Test Session End
  const endReq = {
    method: "POST",
    headers: {},
    body: JSON.stringify({
      visitorId: "test-human-visitor-001",
      sessionId: "test-human-session-001",
      activeDurationSeconds: 50,
    }),
  };
  const endRes = createMockRes();
  await endHandler(endReq, endRes);
  assert(endRes.statusCode === 200, "Session end returns 200");
  assert(endRes.body?.ok === true, "Session end returns ok: true");

  // -------------------------------------------------------------
  // SUITE 6: Security & Admin Authorization
  // -------------------------------------------------------------
  console.log("\n6. Administrative Security & Protection");

  const unauthReq = {
    method: "POST",
    headers: {},
    body: { action: "status" },
  };
  const unauthRes = createMockRes();
  await manageHandler(unauthReq, unauthRes);
  assert(unauthRes.statusCode === 401, "Rejects unauthorized access to management endpoint");

  // Rate Limiting Check
  let rateLimited = false;
  for (let i = 0; i < 35; i++) {
    if (!isAllowed("rate-limit-test-key", 30, 60000)) {
      rateLimited = true;
      break;
    }
  }
  assert(rateLimited === true, "Rate limiter engages after threshold exceeded");

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
  console.error("Test runner error:", err);
  process.exit(1);
});
