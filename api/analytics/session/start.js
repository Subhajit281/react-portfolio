// api/analytics/session/start.js
// Vercel Serverless Function: Initialize or refresh a visitor session
import { config } from "../../lib/config.js";
import { connectToDatabase } from "../../lib/db.js";
import Visitor from "../../lib/models/Visitor.js";
import Session from "../../lib/models/Session.js";
import { getClientIp } from "../../lib/ipUtils.js";
import { isBot } from "../../lib/botFilter.js";
import { parseUserAgent } from "../../lib/uaParser.js";
import { getIpGeoLocation } from "../../lib/geolocation.js";
import { isAllowed } from "../../lib/rateLimit.js";

export default async function handler(req, res) {
  // CORS & Methods
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS,GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({ status: "analytics-session-start-active" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!config.analyticsEnabled) {
    return res.status(200).json({ ok: true, disabled: true });
  }

  try {
    // 1. Determine public client IP authoritatively on server
    const clientIp = getClientIp(req);

    // 2. Rate limit session starts per IP to prevent flood abuse
    if (!isAllowed(`start:${clientIp}`, 30, 60000)) {
      return res.status(429).json({ error: "Rate limit exceeded" });
    }

    // 3. User-Agent parsing & bot filtering
    const rawUserAgent = req.headers["user-agent"] || "";
    if (isBot(rawUserAgent)) {
      // Quietly ignore automated bots without recording them as human portfolio views
      return res.status(200).json({ ok: true, ignored: true, reason: "bot" });
    }

    // 4. Parse request body safely
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};

    const visitorId = typeof body.visitorId === "string" ? body.visitorId.trim().slice(0, 100) : "";
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim().slice(0, 100) : "";
    const referrer = typeof body.referrer === "string" ? body.referrer.trim().slice(0, 500) : "direct";
    const landingPage = typeof body.landingPage === "string" ? body.landingPage.trim().slice(0, 500) : "/";

    if (!visitorId || !sessionId) {
      return res.status(400).json({ error: "visitorId and sessionId are required" });
    }

    // 5. Connect to MongoDB
    const mongooseInstance = await connectToDatabase();
    if (!mongooseInstance) {
      // Fail-safe: if MongoDB is not reachable, do not break the visitor's browsing session
      return res.status(200).json({ ok: true, fallback: true, sessionId });
    }

    const now = new Date();

    // 6. Refresh Protection: Check if session already exists
    const existingSession = await Session.findOne({ sessionId });
    if (existingSession) {
      // Visitor refreshed the page or navigated within the same active session
      // Refresh MUST NOT create another view!
      existingSession.lastSeenAt = now;
      await existingSession.save();

      return res.status(200).json({
        ok: true,
        isRefresh: true,
        sessionId,
      });
    }

    // 7. Handle Visitor Identity (New or Returning)
    let visitor = await Visitor.findOne({ visitorId });
    if (!visitor) {
      // First-time unique visitor
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
      // Returning visitor starting a new session
      visitor.lastSeenAt = now;
      visitor.totalVisits += 1;
      visitor.totalViews += 1;
      if (config.storeRawIp) {
        visitor.lastIp = clientIp;
      }
      await visitor.save();
    }

    // 8. Server-side IP Geolocation (cached, non-blocking fallback)
    const geo = await getIpGeoLocation(clientIp);

    // 9. Parse User-Agent for device, browser, and OS breakdown
    const device = parseUserAgent(rawUserAgent);

    // 10. Compute automatic TTL expiration timestamp
    const expireAt = new Date(Date.now() + config.retentionDays * 86400 * 1000);

    // 11. Create and persist new session document
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

    // 12. Return minimal sanitized response
    return res.status(200).json({
      ok: true,
      isNewSession: true,
      sessionId,
      visitorId,
    });
  } catch (error) {
    console.error("[Analytics API] Session start error:", error.message);
    // Fail-safe: Always return 200 with fallback so the frontend never crashes
    return res.status(200).json({ ok: true, fallback: true, error: "Internal processing fallback" });
  }
}

