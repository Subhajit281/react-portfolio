// api/analytics/manage.js
// Protected administrative endpoint for data retention, system status, and GDPR data subject requests
import { config } from "../lib/config.js";
import { connectToDatabase } from "../lib/db.js";
import Visitor from "../lib/models/Visitor.js";
import Session from "../lib/models/Session.js";
import { anonymizeIp } from "../lib/ipUtils.js";

function authenticateAdmin(req) {
  if (!config.adminAuthSecret) {
    // If no secret configured, management endpoint is locked down
    return false;
  }

  const authHeader = req.headers["authorization"] || "";
  const adminKey = req.headers["x-admin-key"] || "";

  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token === config.adminAuthSecret) return true;
  }

  if (adminKey && adminKey === config.adminAuthSecret) {
    return true;
  }

  return false;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Admin-Key");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Strictly enforce administrative authentication
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

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};

    const action = (body.action || (req.method === "GET" ? "status" : "")).toLowerCase();

    // 1. Status & Configuration Audit
    if (action === "status" || req.method === "GET") {
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

    // 2. Data Subject Request: Delete all records for a visitor (Right to erasure)
    if (action === "delete-visitor") {
      const { visitorId } = body;
      if (!visitorId) {
        return res.status(400).json({ error: "visitorId required for deletion" });
      }

      const [vRes, sRes] = await Promise.all([
        Visitor.deleteOne({ visitorId }),
        Session.deleteMany({ visitorId }),
      ]);

      return res.status(200).json({
        ok: true,
        message: `Visitor data erased`,
        deletedVisitors: vRes.deletedCount,
        deletedSessions: sRes.deletedCount,
      });
    }

    // 3. Delete specific individual session
    if (action === "delete-session") {
      const { sessionId } = body;
      if (!sessionId) {
        return res.status(400).json({ error: "sessionId required for deletion" });
      }

      const resDel = await Session.deleteOne({ sessionId });
      return res.status(200).json({
        ok: true,
        deletedCount: resDel.deletedCount,
      });
    }

    // 4. Data Subject Request: Export data for a visitor (Data portability)
    if (action === "export-visitor") {
      const { visitorId } = body;
      if (!visitorId) {
        return res.status(400).json({ error: "visitorId required for export" });
      }

      const [visitor, sessions] = await Promise.all([
        Visitor.findOne({ visitorId }).lean(),
        Session.find({ visitorId }).sort({ startedAt: -1 }).lean(),
      ]);

      return res.status(200).json({
        ok: true,
        visitor,
        sessions,
      });
    }

    // 5. Redact Raw IPs older than ANALYTICS_RAW_IP_RETENTION_DAYS
    if (action === "redact-old-ips") {
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

      return res.status(200).json({
        ok: true,
        cutoffDate,
        sessionsRedacted: redacted,
      });
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });
  } catch (error) {
    console.error("[Analytics Manage] Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

