// api/lib/geolocation.js
// Configurable server-side IP geolocation with memory caching, timeout protection, and graceful fallback

import { config } from "./config.js";
import { isPrivateIp, normalizeIp } from "./ipUtils.js";

// In-memory cache for IP geolocation results (TTL: 24 hours)
const geoCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_CACHE_SIZE = 5000;

const UNKNOWN_GEO = {
  country: "Unknown",
  countryCode: "XX",
  region: "Unknown",
  city: "Unknown",
  latitude: null,
  longitude: null,
  timezone: "Unknown",
  isp: "Unknown",
};

/**
 * Resolves approximate geographical information from a client's public IP address.
 * Never throws — always returns a valid geo object with fallback values if unavailable.
 */
export async function getIpGeoLocation(ipAddress) {
  const ip = normalizeIp(ipAddress);

  if (!ip || !config.geolocationEnabled) {
    return { ...UNKNOWN_GEO };
  }

  // Handle local development / private network IPs without outbound API calls
  if (isPrivateIp(ip)) {
    return {
      country: "Local Development",
      countryCode: "LOC",
      region: "Local",
      city: "Localhost",
      latitude: 0,
      longitude: 0,
      timezone: "UTC",
      isp: "Internal / Loopback",
    };
  }

  // Check in-memory cache
  const cached = geoCache.get(ip);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    // Construct lookup URL from template or configured provider
    let endpoint = config.geolocationApiUrl.replace("{ip}", encodeURIComponent(ip));
    if (config.geolocationApiKey && !endpoint.includes(config.geolocationApiKey)) {
      const sep = endpoint.includes("?") ? "&" : "?";
      endpoint += `${sep}key=${encodeURIComponent(config.geolocationApiKey)}`;
    }

    // Set 4-second timeout so external latency never delays session creation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Portfolio-Analytics/1.0",
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Geolocation] Provider returned HTTP ${response.status} for ${ip}`);
      return { ...UNKNOWN_GEO };
    }

    const json = await response.json();

    // Standardize data from popular providers (ip-api.com, ipapi.co, ipinfo.io, etc.)
    const geoData = {
      country: json.country || json.country_name || "Unknown",
      countryCode: (json.countryCode || json.country_code || "XX").toUpperCase(),
      region: json.regionName || json.region || json.state || "Unknown",
      city: json.city || "Unknown",
      latitude: typeof json.lat === "number" ? json.lat : typeof json.latitude === "number" ? json.latitude : null,
      longitude: typeof json.lon === "number" ? json.lon : typeof json.longitude === "number" ? json.longitude : null,
      timezone: json.timezone || json.time_zone || "Unknown",
      isp: json.isp || json.org || json.organization || "Unknown",
    };

    // Store in cache (with LRU size limit pruning)
    if (geoCache.size >= MAX_CACHE_SIZE) {
      const oldestKey = geoCache.keys().next().value;
      geoCache.delete(oldestKey);
    }
    geoCache.set(ip, { data: geoData, timestamp: Date.now() });

    return geoData;
  } catch (error) {
    // Non-fatal: timeout or network error fallback
    console.warn(`[Geolocation] Lookup failed for ${ip}:`, error.message);
    return { ...UNKNOWN_GEO };
  }
}

