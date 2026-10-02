// api/lib/ipUtils.js
// Safe, server-side client IP resolution and private range verification

/**
 * Normalizes IP format (e.g. removes IPv6 IPv4-mapping prefix)
 */
export function normalizeIp(ip) {
  if (!ip) return "";
  let clean = ip.trim();
  if (clean.startsWith("::ffff:")) {
    clean = clean.replace("::ffff:", "");
  }
  return clean;
}

/**
 * Checks if an IP is in a private, loopback, or local link network range.
 */
export function isPrivateIp(ip) {
  if (!ip) return true;
  const clean = normalizeIp(ip);

  if (
    clean === "127.0.0.1" ||
    clean === "::1" ||
    clean === "localhost" ||
    clean === "0.0.0.0"
  ) {
    return true;
  }

  // IPv4 Private ranges:
  // 10.0.0.0 - 10.255.255.255
  // 172.16.0.0 - 172.31.255.255
  // 192.168.0.0 - 192.168.255.255
  // 169.254.0.0 - 169.254.255.255 (link-local)
  const ipv4Parts = clean.split(".").map(Number);
  if (ipv4Parts.length === 4 && ipv4Parts.every((n) => !isNaN(n))) {
    const [p0, p1] = ipv4Parts;
    if (p0 === 10) return true;
    if (p0 === 172 && p1 >= 16 && p1 <= 31) return true;
    if (p0 === 192 && p1 === 168) return true;
    if (p0 === 169 && p1 === 254) return true;
  }

  // IPv6 Private / Local ranges:
  // fc00::/7 (unique local), fe80::/10 (link-local)
  const lower = clean.toLowerCase();
  if (
    lower.startsWith("fc") ||
    lower.startsWith("fd") ||
    lower.startsWith("fe8") ||
    lower.startsWith("fe9") ||
    lower.startsWith("fea") ||
    lower.startsWith("feb")
  ) {
    return true;
  }

  return false;
}

/**
 * Authoritatively determines the visitor's public IP from the request.
 * NEVER accepts a client-provided IP from request body or query parameter!
 * Correctly handles reverse proxy headers (e.g. Vercel, Cloudflare, AWS ALB).
 */
export function getClientIp(req) {
  // 1. Check Vercel / Standard Proxy header
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (xForwardedFor) {
    // When behind trusted proxies, the first comma-separated address is the original client IP
    const ips = String(xForwardedFor).split(",");
    const clientIp = ips[0].trim();
    if (clientIp) {
      return normalizeIp(clientIp);
    }
  }

  // 2. Check x-real-ip (common in NGINX, Cloudflare, Vercel)
  const xRealIp = req.headers["x-real-ip"];
  if (xRealIp) {
    return normalizeIp(String(xRealIp).trim());
  }

  // 3. Fallback to direct socket address
  const socketAddress =
    req.socket?.remoteAddress || req.connection?.remoteAddress || "";
  return normalizeIp(socketAddress) || "127.0.0.1";
}

/**
 * Anonymizes an IP address by masking the final octet/hextet.
 * Used when raw IP retention expires or privacy masking is active.
 */
export function anonymizeIp(ip) {
  if (!ip) return "";
  const clean = normalizeIp(ip);

  if (clean.includes(".")) {
    const parts = clean.split(".");
    if (parts.length === 4) {
      parts[3] = "0";
      return parts.join(".");
    }
  }

  if (clean.includes(":")) {
    const parts = clean.split(":");
    return parts.slice(0, 3).join(":") + "::0";
  }

  return "Anonymized";
}

