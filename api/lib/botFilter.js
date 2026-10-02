// api/lib/botFilter.js
// Conservative automated crawler and search-engine bot detection

const BOT_PATTERNS = [
  // Major Search Engines
  /googlebot/i,
  /bingbot/i,
  /yandex(bot)?/i,
  /baiduspider/i,
  /duckduckbot/i,
  /slurp/i, // Yahoo
  /sogou/i,
  /exabot/i,
  /seznambot/i,

  // Social & Preview Scrapers
  /facebookexternalhit/i,
  /meta-externalagent/i,
  /twitterbot/i,
  /linkedinbot/i,
  /slackbot/i,
  /discordbot/i,
  /telegrambot/i,
  /whatsapp/i,
  /pinterest/i,
  /applebot/i,

  // SEO & Technical Crawlers
  /ahrefsbot/i,
  /semrushbot/i,
  /dotbot/i,
  /rogerbot/i,
  /mj12bot/i,
  /screaming frog/i,
  /uptime(robot)?/i,
  /pingdom/i,
  /headlesschrome/i,
  /phantomjs/i,
  /puppeteer/i,
  /playwright/i,
  /selenium/i,

  // CLI Tools & Common HTTP Libraries
  /curl\//i,
  /wget\//i,
  /python-requests/i,
  /axios\//i,
  /go-http-client/i,
  /postmanruntime/i,
  /insomnia/i,
  /java\//i,
  /apache-httpclient/i,

  // Generic crawler / spider keywords
  /bot\b/i,
  /crawler/i,
  /spider/i,
  /archiver/i,
  /scrape/i,
];

/**
 * Checks whether a given User-Agent string belongs to an automated crawler or bot.
 * Conservative: Does NOT classify legitimate unknown browsers as bots.
 */
export function isBot(userAgent) {
  if (!userAgent || typeof userAgent !== "string") {
    // Missing user agent or non-browser client is treated as automated/unverified
    return true;
  }

  const trimmed = userAgent.trim();
  if (trimmed.length < 10) {
    return true;
  }

  for (const pattern of BOT_PATTERNS) {
    if (pattern.test(trimmed)) {
      return true;
    }
  }

  return false;
}

