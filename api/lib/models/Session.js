// api/lib/models/Session.js
import mongoose from "mongoose";

const GeoSchema = new mongoose.Schema(
  {
    country: { type: String, default: "Unknown", index: true },
    countryCode: { type: String, default: "XX" },
    region: { type: String, default: "Unknown", index: true },
    city: { type: String, default: "Unknown", index: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    timezone: { type: String, default: "Unknown" },
    isp: { type: String, default: "Unknown" },
  },
  { _id: false }
);

const DeviceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "bot", "unknown"],
      default: "unknown",
      index: true,
    },
    browser: { type: String, default: "Unknown", index: true },
    browserVersion: { type: String, default: "" },
    os: { type: String, default: "Unknown", index: true },
    osVersion: { type: String, default: "" },
  },
  { _id: false }
);

const SessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    visitorId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    ipAddress: {
      type: String,
      default: null,
      index: true,
      trim: true,
    },
    geo: {
      type: GeoSchema,
      default: () => ({}),
    },
    device: {
      type: DeviceSchema,
      default: () => ({}),
    },
    userAgent: {
      raw: { type: String, default: "" },
    },
    referrer: {
      type: String,
      default: "direct",
      trim: true,
    },
    landingPage: {
      type: String,
      default: "/",
      trim: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    durationSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    isBot: {
      type: Boolean,
      default: false,
      index: true,
    },
    // MongoDB TTL Index: documents automatically purged after expireAt timestamp
    expireAt: {
      type: Date,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
    collection: "sessions",
  }
);

// Compound index for frequent analytics queries: visitor timeline
SessionSchema.index({ visitorId: 1, startedAt: -1 });

// Prevent re-compilation of model in hot-reloading / serverless environments
export default mongoose.models.Session ||
  mongoose.model("Session", SessionSchema);

