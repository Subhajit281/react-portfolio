// api/analytics/session/end.js
// Vercel Serverless Function: Finalizes session on pagehide/visibilitychange/leave
import { config } from "../../lib/config.js";
import { connectToDatabase } from "../../lib/db.js";
import Session from "../../lib/models/Session.js";
import Visitor from "../../lib/models/Visitor.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS,GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({ status: "analytics-session-end-active" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!config.analyticsEnabled) {
    return res.status(200).json({ ok: true, disabled: true });
  }

  try {
    // navigator.sendBeacon can send raw string or blob
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};

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

    // Update visitor lastSeenAt
    await Visitor.updateOne({ visitorId }, { $set: { lastSeenAt: now } }).catch(() => {});

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[Analytics API] Session end error:", error.message);
    return res.status(200).json({ ok: true, fallback: true });
  }
}

