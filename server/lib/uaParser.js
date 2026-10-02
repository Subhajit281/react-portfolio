// api/lib/uaParser.js
// Lightweight, zero-dependency User-Agent parser for device, browser, and OS breakdown

export function parseUserAgent(uaString) {
  if (!uaString || typeof uaString !== "string") {
    return {
      type: "unknown",
      browser: "Unknown",
      browserVersion: "",
      os: "Unknown",
      osVersion: "",
    };
  }

  const ua = uaString;

  // 1. Determine Device Type
  let type = "desktop";
  if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(ua)) {
    type = "tablet";
  } else if (/(iphone|ipod|mobile|android.*mobile|blackberry|iemobile|kindle|opera mobi|opera mini)/i.test(ua)) {
    type = "mobile";
  }

  // 2. Determine Browser & Version
  let browser = "Unknown";
  let browserVersion = "";

  if (/edg\/([0-9.]+)/i.test(ua)) {
    browser = "Edge";
    browserVersion = ua.match(/edg\/([0-9.]+)/i)?.[1] || "";
  } else if (/opr\/([0-9.]+)|opera\/([0-9.]+)/i.test(ua)) {
    browser = "Opera";
    browserVersion = ua.match(/(?:opr|opera)\/([0-9.]+)/i)?.[1] || "";
  } else if (/samsungbrowser\/([0-9.]+)/i.test(ua)) {
    browser = "Samsung Internet";
    browserVersion = ua.match(/samsungbrowser\/([0-9.]+)/i)?.[1] || "";
  } else if (/chrome\/([0-9.]+)/i.test(ua)) {
    browser = "Chrome";
    browserVersion = ua.match(/chrome\/([0-9.]+)/i)?.[1] || "";
  } else if (/firefox\/([0-9.]+)/i.test(ua)) {
    browser = "Firefox";
    browserVersion = ua.match(/firefox\/([0-9.]+)/i)?.[1] || "";
  } else if (/version\/([0-9.]+).*safari/i.test(ua)) {
    browser = "Safari";
    browserVersion = ua.match(/version\/([0-9.]+).*safari/i)?.[1] || "";
  } else if (/msie\s([0-9.]+)|trident\/.*rv:([0-9.]+)/i.test(ua)) {
    browser = "Internet Explorer";
    browserVersion = ua.match(/(?:msie\s|rv:)([0-9.]+)/i)?.[1] || "";
  }

  // 3. Determine Operating System & Version
  let os = "Unknown";
  let osVersion = "";

  if (/windows nt 10\.0/i.test(ua)) {
    os = "Windows";
    osVersion = "10/11";
  } else if (/windows nt 6\.3/i.test(ua)) {
    os = "Windows";
    osVersion = "8.1";
  } else if (/windows nt 6\.2/i.test(ua)) {
    os = "Windows";
    osVersion = "8";
  } else if (/windows nt 6\.1/i.test(ua)) {
    os = "Windows";
    osVersion = "7";
  } else if (/windows nt/i.test(ua)) {
    os = "Windows";
  } else if (/mac os x\s*([0-9_]+)/i.test(ua)) {
    os = "macOS";
    osVersion = (ua.match(/mac os x\s*([0-9_]+)/i)?.[1] || "").replace(/_/g, ".");
  } else if (/iphone os\s*([0-9_]+)|ipad; cpu os\s*([0-9_]+)/i.test(ua)) {
    os = "iOS";
    osVersion = (ua.match(/(?:iphone os|cpu os)\s*([0-9_]+)/i)?.[1] || "").replace(/_/g, ".");
  } else if (/android\s*([0-9.]+)/i.test(ua)) {
    os = "Android";
    osVersion = ua.match(/android\s*([0-9.]+)/i)?.[1] || "";
  } else if (/cros/i.test(ua)) {
    os = "ChromeOS";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
  }

  return {
    type,
    browser,
    browserVersion: browserVersion.split(".").slice(0, 2).join("."), // e.g. "124.0"
    os,
    osVersion,
  };
}

