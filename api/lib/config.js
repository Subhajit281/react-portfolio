// api/lib/config.js
// Centralized configuration for the Portfolio Visitor Analytics System
import dotenv from "dotenv";

// Load local .env file immediately
dotenv.config();

export const config = {
  // MongoDB Connection URI (dynamic getter to ensure process.env is read freshly)
  get mongodbUri() {
    return process.env.MONGODB_URI || "";
  },

  // Geolocation provider settings
  get geolocationApiKey() {
    return process.env.GEOLOCATION_API_KEY || "";
  },
  get geolocationApiUrl() {
    return (
      process.env.GEOLOCATION_API_URL ||
      "http://ip-api.com/json/{ip}?fields=status,message,country,countryCode,regionName,city,lat,lon,timezone,isp,org"
    );
  },
  get geolocationEnabled() {
    return process.env.ANALYTICS_GEOLOCATION_ENABLED !== "false";
  },

  // Analytics master switch
  get analyticsEnabled() {
    return process.env.ANALYTICS_ENABLED !== "false";
  },

  // Consent requirement (default: false, transparent notice given)
  get analyticsRequireConsent() {
    return process.env.ANALYTICS_REQUIRE_CONSENT === "true";
  },

  // Session inactivity timeout in minutes (default: 30 minutes)
  get sessionTimeoutMinutes() {
    return Math.max(
      5,
      parseInt(process.env.ANALYTICS_SESSION_TIMEOUT_MINUTES || "30", 10)
    );
  },

  // Heartbeat interval in seconds
  get heartbeatIntervalSeconds() {
    return Math.max(
      15,
      parseInt(process.env.ANALYTICS_HEARTBEAT_INTERVAL_SECONDS || "30", 10)
    );
  },

  // Data retention in days for sessions (MongoDB TTL index)
  get retentionDays() {
    return Math.max(
      7,
      parseInt(process.env.ANALYTICS_RETENTION_DAYS || "90", 10)
    );
  },

  // Raw IP retention in days before redaction
  get rawIpRetentionDays() {
    return Math.max(
      1,
      parseInt(process.env.ANALYTICS_RAW_IP_RETENTION_DAYS || "30", 10)
    );
  },

  // Whether to store raw IP or only derive geolocation
  get storeRawIp() {
    return process.env.ANALYTICS_STORE_RAW_IP !== "false";
  },

  // Secret token for administrative maintenance and data subject requests
  get adminAuthSecret() {
    return process.env.ADMIN_AUTH_SECRET || "";
  },
};
