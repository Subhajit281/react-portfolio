// api/analytics.js
// Consolidated Vercel Serverless Function: Handles all portfolio analytics & view tracking
import { config } from "../server/lib/config.js";
import { connectToDatabase } from "../server/lib/db.js";
import Visitor from "../server/lib/models/Visitor.js";
import Session from "../server/lib/models/Session.js";
import { getClientIp, anonymizeIp } from "../server/lib/ipUtils.js";
import { isBot } from "../server/lib/botFilter.js";
import { parseUserAgent } from "../server/lib/uaParser.js";
import { getIpGeoLocation } from "../server/lib/geolocation.js";
import { isAllowed } from "../server/lib/rateLimit.js";

// Helper: authenticate administrative requests
function authenticateAdmin(req) {
  if (!config.adminAuthSecret) return false;
  const authHeader = req.headers["authorization"] || "";
  const adminKey = req.headers["x-admin-key"] || "";
  if (authHeader.startsWith("Bearer ") && authHeader.substring(7).trim() === config.adminAuthSecret) {
    return true;
  }
  if (adminKey && adminKey === config.adminAuthSecret) {
    return true;
  }
  return false;
}

// Helper: parse incoming body (handles object, JSON string, or raw sendBeacon text)
function parseRequestBody(req) {
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  return body || {};
}

// Helper: resolve action from Vercel rewrite query, url path, query parameter, or body payload
function resolveAction(req, body) {
  // 1. From Vercel rewrite parameter: /api/analytics/(.*) -> endpoint=$1
  const endpoint = (req.query?.endpoint || "").toLowerCase().trim();
  if (endpoint.includes("start") || endpoint === "session/start") return "start";
  if (endpoint.includes("heartbeat") || endpoint === "session/heartbeat") return "heartbeat";
  if (endpoint.includes("end") || endpoint === "session/end") return "end";
  if (endpoint.includes("manage") || endpoint === "manage") return "manage";

  // 2. From URL path directly (e.g. dev-server or direct calls)
  const urlPath = (req.url || "").toLowerCase();
  if (urlPath.includes("/session/start")) return "start";
  if (urlPath.includes("/session/heartbeat")) return "heartbeat";
  if (urlPath.includes("/session/end")) return "end";
  if (urlPath.includes("/manage")) return "manage";

  // 3. From query parameter: ?action=...
  const queryAction = (req.query?.action || "").toLowerCase().trim();
  if (["start", "heartbeat", "end", "manage", "status"].includes(queryAction)) return queryAction;

  // 4. From body payload: { action: "..." }
  const bodyAction = (body?.action || "").toLowerCase().trim();
  if (["start", "heartbeat", "end", "manage", "status"].includes(bodyAction)) return bodyAction;

  // 5. Inferred from payload attributes
  if (body?.activeDurationSeconds !== undefined && body?.endedAt) return "end";
  if (body?.activeDurationSeconds !== undefined) return "heartbeat";
  if (body?.visitorId && body?.sessionId) return "start";

  return req.method === "GET" ? "status" : "unknown";
}

// ---------------------------------------------------------------------------
// Action Handlers
// ---------------------------------------------------------------------------

async function handleSessionStart(req, res, body) {
  const clientIp = getClientIp(req);

  // Rate limit session starts per IP to prevent flood abuse
  if (!isAllowed(`start:${clientIp}`, 30, 60000)) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  // User-Agent parsing & bot filtering
  const rawUserAgent = req.headers["user-agent"] || "";
  if (isBot(rawUserAgent)) {
    return res.status(200).json({ ok: true, ignored: true, reason: "bot" });
  }

  const visitorId = typeof body.visitorId === "string" ? body.visitorId.trim().slice(0, 100) : "";
  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim().slice(0, 100) : "";
  const referrer = typeof body.referrer === "string" ? body.referrer.trim().slice(0, 500) : "direct";
  const landingPage = typeof body.landingPage === "string" ? body.landingPage.trim().slice(0, 500) : "/";

  if (!visitorId || !sessionId) {
    return res.status(400).json({ error: "visitorId and sessionId are required" });
  }

  const mongooseInstance = await connectToDatabase();
  if (!mongooseInstance) {
    return res.status(200).json({ ok: true, fallback: true, sessionId });
  }

  const now = new Date();

  // Refresh Protection: Check if session already exists
  const existingSession = await Session.findOne({ sessionId });
  if (existingSession) {
    existingSession.lastSeenAt = now;
    await existingSession.save();
    return res.status(200).json({
      ok: true,
      isRefresh: true,
      sessionId,
    });
  }

  // Handle Visitor Identity (New or Returning)
  let visitor = await Visitor.findOne({ visitorId });
  if (!visitor) {
    visitor = new Visitor({
      visitorId,
      firstSeenAt: now,
      lastSeenAt: now,
      totalVisits: 1,
      totalViews: 1,
      lastIp: config.storeRawIp ? clientIp : null,
    });
    await visitor.save();
  } else {
    visitor.lastSeenAt = now;
    visitor.totalVisits += 1;
    visitor.totalViews += 1;
    if (config.storeRawIp) {
      visitor.lastIp = clientIp;
    }
    await visitor.save();
  }

  // Server-side IP Geolocation & User-Agent parsing
  const geo = await getIpGeoLocation(clientIp);
  const device = parseUserAgent(rawUserAgent);
  const expireAt = new Date(Date.now() + config.retentionDays * 86400 * 1000);

  const newSession = new Session({
    sessionId,
    visitorId,
    ipAddress: config.storeRawIp ? clientIp : null,
    geo,
    device,
    userAgent: { raw: rawUserAgent.slice(0, 500) },
    referrer: referrer || "direct",
    landingPage: landingPage || "/",
    startedAt: now,
    lastSeenAt: now,
    durationSeconds: 0,
    isBot: false,
    expireAt,
  });

  await newSession.save();

  return res.status(200).json({
    ok: true,
    isNewSession: true,
    sessionId,
    visitorId,
  });
}

async function handleSessionHeartbeat(req, res, body) {
  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim().slice(0, 100) : "";
  const visitorId = typeof body.visitorId === "string" ? body.visitorId.trim().slice(0, 100) : "";
  const activeDurationSeconds =
    typeof body.activeDurationSeconds === "number" && !isNaN(body.activeDurationSeconds)
      ? Math.max(0, Math.floor(body.activeDurationSeconds))
      : null;

  if (!sessionId || !visitorId) {
    return res.status(400).json({ error: "sessionId and visitorId are required" });
  }

  if (!isAllowed(`hb:${sessionId}`, 20, 60000)) {
    return res.status(429).json({ error: "Heartbeat throttled" });
  }

  const mongooseInstance = await connectToDatabase();
  if (!mongooseInstance) {
    return res.status(200).json({ ok: true, fallback: true });
  }

  const session = await Session.findOne({ sessionId, visitorId });
  if (!session) {
    return res.status(200).json({ ok: false, error: "Session not found" });
  }

  const now = new Date();
  session.lastSeenAt = now;

  if (activeDurationSeconds !== null) {
    session.durationSeconds = activeDurationSeconds;
  } else {
    const elapsed = Math.round((now.getTime() - session.startedAt.getTime()) / 1000);
    session.durationSeconds = Math.max(session.durationSeconds || 0, elapsed);
  }

  await session.save();
  return res.status(200).json({ ok: true });
}

async function handleSessionEnd(req, res, body) {
  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim().slice(0, 100) : "";
  const visitorId = typeof body.visitorId === "string" ? body.visitorId.trim().slice(0, 100) : "";
  const activeDurationSeconds =
    typeof body.activeDurationSeconds === "number" && !isNaN(body.activeDurationSeconds)
      ? Math.max(0, Math.floor(body.activeDurationSeconds))
      : null;

  if (!sessionId || !visitorId) {
    return res.status(400).json({ error: "sessionId and visitorId are required" });
  }

  const mongooseInstance = await connectToDatabase();
  if (!mongooseInstance) {
    return res.status(200).json({ ok: true, fallback: true });
  }

  const session = await Session.findOne({ sessionId, visitorId });
  if (!session) {
    return res.status(200).json({ ok: false, error: "Session not found" });
  }

  const now = new Date();
  session.endedAt = now;
  session.lastSeenAt = now;

  if (activeDurationSeconds !== null) {
    session.durationSeconds = activeDurationSeconds;
  } else {
    const elapsed = Math.round((now.getTime() - session.startedAt.getTime()) / 1000);
    session.durationSeconds = Math.max(session.durationSeconds || 0, elapsed);
  }

  await session.save();
  await Visitor.updateOne({ visitorId }, { $set: { lastSeenAt: now } }).catch(() => {});

  return res.status(200).json({ ok: true });
}

async function handleManage(req, res, body) {
  if (!authenticateAdmin(req)) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Valid ADMIN_AUTH_SECRET bearer token or X-Admin-Key header required.",
    });
  }

  const mongooseInstance = await connectToDatabase();
  if (!mongooseInstance) {
    return res.status(503).json({ error: "Database unavailable" });
  }

  const subAction = (body.action || (req.method === "GET" ? "status" : "")).toLowerCase();

  if (subAction === "status" || req.method === "GET") {
    const [visitorCount, sessionCount, recentSessions] = await Promise.all([
      Visitor.countDocuments().catch(() => 0),
      Session.countDocuments().catch(() => 0),
      Session.find().sort({ startedAt: -1 }).limit(5).lean().catch(() => []),
    ]);

    return res.status(200).json({
      ok: true,
      analyticsEnabled: config.analyticsEnabled,
      requireConsent: config.analyticsRequireConsent,
      retentionDays: config.retentionDays,
      rawIpRetentionDays: config.rawIpRetentionDays,
      sessionTimeoutMinutes: config.sessionTimeoutMinutes,
      heartbeatIntervalSeconds: config.heartbeatIntervalSeconds,
      storeRawIp: config.storeRawIp,
      totalVisitors: visitorCount,
      totalSessions: sessionCount,
      recentSampleCount: recentSessions.length,
    });
  }

  if (subAction === "delete-visitor") {
    const { visitorId } = body;
    if (!visitorId) return res.status(400).json({ error: "visitorId required" });
    const [vRes, sRes] = await Promise.all([
      Visitor.deleteOne({ visitorId }),
      Session.deleteMany({ visitorId }),
    ]);
    return res.status(200).json({
      ok: true,
      message: "Visitor data erased",
      deletedVisitors: vRes.deletedCount,
      deletedSessions: sRes.deletedCount,
    });
  }

  if (subAction === "delete-session") {
    const { sessionId } = body;
    if (!sessionId) return res.status(400).json({ error: "sessionId required" });
    const resDel = await Session.deleteOne({ sessionId });
    return res.status(200).json({ ok: true, deletedCount: resDel.deletedCount });
  }

  if (subAction === "export-visitor") {
    const { visitorId } = body;
    if (!visitorId) return res.status(400).json({ error: "visitorId required" });
    const [visitor, sessions] = await Promise.all([
      Visitor.findOne({ visitorId }).lean(),
      Session.find({ visitorId }).sort({ startedAt: -1 }).lean(),
    ]);
    return res.status(200).json({ ok: true, visitor, sessions });
  }

  if (subAction === "redact-old-ips") {
    const cutoffDate = new Date(Date.now() - config.rawIpRetentionDays * 86400 * 1000);
    const sessionsToRedact = await Session.find({
      startedAt: { $lt: cutoffDate },
      ipAddress: { $ne: null },
    }).limit(500);

    let redacted = 0;
    for (const s of sessionsToRedact) {
      if (s.ipAddress && !s.ipAddress.endsWith(".0")) {
        s.ipAddress = anonymizeIp(s.ipAddress);
        await s.save();
        redacted++;
      }
    }
    return res.status(200).json({ ok: true, cutoffDate, sessionsRedacted: redacted });
  }

  return res.status(400).json({ error: `Unknown management action: ${subAction}` });
}

// ---------------------------------------------------------------------------
// Main Consolidated Entry Point
// ---------------------------------------------------------------------------

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Admin-Key");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (!config.analyticsEnabled) {
    return res.status(200).json({ ok: true, disabled: true });
  }

  const body = parseRequestBody(req);
  const action = resolveAction(req, body);

  try {
    switch (action) {
      case "start":
        return await handleSessionStart(req, res, body);
      case "heartbeat":
        return await handleSessionHeartbeat(req, res, body);
      case "end":
        return await handleSessionEnd(req, res, body);
      case "manage":
        return await handleManage(req, res, body);
      case "status":
        if (authenticateAdmin(req)) {
          return await handleManage(req, res, body);
        }
        return res.status(200).json({ ok: true, status: "portfolio-analytics-ready", version: "2.0" });
      default:
        return res.status(400).json({
          error: "Invalid analytics endpoint or action",
          supportedActions: ["start", "heartbeat", "end", "manage"],
        });
    }
  } catch (error) {
    console.error("[Analytics Gateway] Error:", error.message);
    return res.status(200).json({ ok: true, fallback: true, error: "Internal processing fallback" });
  }
}

