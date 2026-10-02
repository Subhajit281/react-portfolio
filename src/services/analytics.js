// src/services/analytics.js
// Production-grade, privacy-conscious client-side analytics service

const STORAGE_KEYS = {
  VISITOR_ID: "portfolio_visitor_id",
  SESSION_ID: "portfolio_session_id",
  LAST_ACTIVE: "portfolio_last_active",
  CONSENT: "portfolio_analytics_consent",
};

// Default configuration (can be tuned via Vite env vars)
const CONFIG = {
  sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes
  heartbeatIntervalMs: 25 * 1000,   // 25 seconds
  requireConsent: import.meta.env.VITE_ANALYTICS_REQUIRE_CONSENT === "true",
};

/**
 * Generates an opaque random UUID for visitor / session identification.
 * Does NOT contain personal information.
 */
function generateUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Safely access localStorage without throwing in restricted browser contexts
 */
function getStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Fail silently in private/sandboxed contexts
  }
}

class PortfolioAnalytics {
  constructor() {
    this.visitorId = null;
    this.sessionId = null;
    this.heartbeatTimer = null;
    this.activeDurationSeconds = 0;
    this.lastActiveTimestamp = Date.now();
    this.isVisible = true;
    this.isTracking = false;
    this.initialized = false;
  }

  /**
   * Retrieves or creates the anonymous visitor identifier.
   * Preserved across browser restarts until localStorage/cookies are cleared.
   */
  getOrCreateVisitorId() {
    let vid = getStorage(STORAGE_KEYS.VISITOR_ID);
    if (!vid || vid.length < 10) {
      vid = generateUUID();
      setStorage(STORAGE_KEYS.VISITOR_ID, vid);
    }
    return vid;
  }

  /**
   * Retrieves active session or generates a new session if inactive timeout has elapsed.
   * A page refresh keeps the same sessionId and does NOT increment views.
   */
  getOrCreateSessionId() {
    const now = Date.now();
    const existingSessionId = getStorage(STORAGE_KEYS.SESSION_ID);
    const lastActive = parseInt(getStorage(STORAGE_KEYS.LAST_ACTIVE) || "0", 10);

    if (existingSessionId && now - lastActive < CONFIG.sessionTimeoutMs) {
      // Reuse existing active session (refresh or fast navigation)
      setStorage(STORAGE_KEYS.LAST_ACTIVE, now.toString());
      return existingSessionId;
    }

    // Inactivity timeout exceeded or first session: Start fresh session
    const newSessionId = generateUUID();
    setStorage(STORAGE_KEYS.SESSION_ID, newSessionId);
    setStorage(STORAGE_KEYS.LAST_ACTIVE, now.toString());
    return newSessionId;
  }

  /**
   * Checks current consent state:
   * - If consent is required: true only if explicitly granted.
   * - If consent is not required: true unless explicitly denied.
   */
  hasConsent() {
    const consent = getStorage(STORAGE_KEYS.CONSENT);
    if (consent === "denied") return false;
    if (CONFIG.requireConsent) {
      return consent === "granted";
    }
    return true;
  }

  /**
   * Main initializer: called once when the portfolio boots.
   */
  init() {
    if (this.initialized || typeof window === "undefined") return;
    this.initialized = true;

    if (!this.hasConsent()) {
      return;
    }

    this.startTracking();
  }

  /**
   * Starts tracking: initializes session, hooks visibility and exit listeners.
   */
  startTracking() {
    if (this.isTracking) return;
    this.isTracking = true;

    this.visitorId = this.getOrCreateVisitorId();
    this.sessionId = this.getOrCreateSessionId();
    this.lastActiveTimestamp = Date.now();
    this.isVisible = document.visibilityState === "visible";

    // 1. Send session start / refresh notice to backend
    this.sendSessionStart();

    // 2. Setup periodic heartbeat
    this.setupHeartbeat();

    // 3. Setup active engagement / visibility tracking
    this.setupVisibilityListeners();

    // 4. Setup graceful session exit tracking
    this.setupExitListeners();
  }

  /**
   * Sends session start or refresh to the backend.
   * Refresh protection is enforced server-side via sessionId lookup.
   */
  async sendSessionStart() {
    try {
      const payload = {
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        referrer: document.referrer || "direct",
        landingPage: window.location.pathname || "/",
      };

      await fetch("/api/analytics/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Fail-safe: Network error or server offline must never interrupt portfolio
    }
  }

  /**
   * Setup periodic heartbeat every ~25s to measure duration without flooding server
   */
  setupHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);

    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, CONFIG.heartbeatIntervalMs);
  }

  /**
   * Sends heartbeat payload with updated active duration
   */
  async sendHeartbeat() {
    if (!this.isTracking || !this.sessionId) return;

    this.updateActiveTime();

    try {
      const payload = {
        sessionId: this.sessionId,
        visitorId: this.visitorId,
        activeDurationSeconds: this.activeDurationSeconds,
      };

      await fetch("/api/analytics/session/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setStorage(STORAGE_KEYS.LAST_ACTIVE, Date.now().toString());
    } catch {
      // Fail silently
    }
  }

  /**
   * Accumulates active engaged time only when page is visible
   */
  updateActiveTime() {
    const now = Date.now();
    if (this.isVisible) {
      const deltaSec = Math.round((now - this.lastActiveTimestamp) / 1000);
      if (deltaSec > 0 && deltaSec < 60) {
        this.activeDurationSeconds += deltaSec;
      }
    }
    this.lastActiveTimestamp = now;
  }

  /**
   * Tracks visibility state so tab switching pauses active time accumulation
   */
  setupVisibilityListeners() {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.updateActiveTime();
        this.isVisible = false;
        // Send interim heartbeat before tab goes to sleep
        this.sendHeartbeat();
      } else {
        this.lastActiveTimestamp = Date.now();
        this.isVisible = true;
      }
    });

    // Also update activity on user interaction
    const touchOrMove = () => {
      setStorage(STORAGE_KEYS.LAST_ACTIVE, Date.now().toString());
    };
    window.addEventListener("click", touchOrMove, { passive: true });
    window.addEventListener("keydown", touchOrMove, { passive: true });
  }

  /**
   * Captures page unload/hide using navigator.sendBeacon
   */
  setupExitListeners() {
    const handleExit = () => {
      if (!this.isTracking || !this.sessionId) return;
      this.updateActiveTime();

      const payload = JSON.stringify({
        sessionId: this.sessionId,
        visitorId: this.visitorId,
        activeDurationSeconds: this.activeDurationSeconds,
      });

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/session/end", blob);
      } else {
        fetch("/api/analytics/session/end", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    };

    window.addEventListener("pagehide", handleExit);
    window.addEventListener("beforeunload", handleExit);
  }

  /**
   * User grants analytics consent
   */
  grantConsent() {
    setStorage(STORAGE_KEYS.CONSENT, "granted");
    this.startTracking();
  }

  /**
   * User withdraws or declines analytics consent
   */
  revokeConsent() {
    setStorage(STORAGE_KEYS.CONSENT, "denied");
    this.stopTracking();
  }

  /**
   * Stops tracking immediately and cleans up timers
   */
  stopTracking() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.isTracking && this.sessionId) {
      // Send quick final end request
      const payload = JSON.stringify({
        sessionId: this.sessionId,
        visitorId: this.visitorId,
        activeDurationSeconds: this.activeDurationSeconds,
      });
      fetch("/api/analytics/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }

    this.isTracking = false;
  }

  getConsentChoice() {
    return getStorage(STORAGE_KEYS.CONSENT);
  }
}

// Singleton export
export const analytics = new PortfolioAnalytics();
export default analytics;

