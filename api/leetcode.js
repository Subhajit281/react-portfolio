// api/leetcode.js  —  Vercel Serverless Function
// Place this file at the ROOT of your project: react-portfolio/api/leetcode.js
// Vercel auto-discovers any file inside /api and deploys it as a serverless endpoint.
// Your frontend calls: /api/leetcode?username=_vapourX
// This runs server-side so there is zero CORS issue with leetcode.com

export default async function handler(req, res) {
  // Allow your frontend origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "username is required" });

  const GQL = "https://leetcode.com/graphql";
  const headers = {
    "Content-Type": "application/json",
    "Referer": "https://leetcode.com",
    "User-Agent": "Mozilla/5.0",
  };

  try {
    // ── 1. Stats query ────────────────────────────────────────────────────────
    const statsQuery = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats: submitStatsGlobal {
              acSubmissionNum { difficulty count }
            }
            profile { ranking }
          }
        }
      `,
      variables: { username },
    };

    // ── 2. Calendar query (current year + previous year for full 52 weeks) ───
    const currentYear = new Date().getFullYear();
    const calQuery = (year) => ({
      query: `
        query userCalendar($username: String!, $year: Int) {
          matchedUser(username: $username) {
            userCalendar(year: $year) { submissionCalendar }
          }
        }
      `,
      variables: { username, year },
    });

    const [statsRes, calCurrRes, calPrevRes] = await Promise.all([
      fetch(GQL, { method: "POST", headers, body: JSON.stringify(statsQuery) }),
      fetch(GQL, { method: "POST", headers, body: JSON.stringify(calQuery(currentYear)) }),
      fetch(GQL, { method: "POST", headers, body: JSON.stringify(calQuery(currentYear - 1)) }),
    ]);

    const [statsData, calCurr, calPrev] = await Promise.all([
      statsRes.json(),
      calCurrRes.json(),
      calPrevRes.json(),
    ]);

    // ── Parse stats ───────────────────────────────────────────────────────────
    const acNums = statsData?.data?.matchedUser?.submitStats?.acSubmissionNum ?? [];
    const get = (diff) => acNums.find((x) => x.difficulty === diff)?.count ?? 0;

    // ── Merge both years' calendars into one map ───────────────────────────────
    const mergedCalendar = {};
    for (const calData of [calPrev, calCurr]) {
      const raw = calData?.data?.matchedUser?.userCalendar?.submissionCalendar;
      if (raw) {
        Object.entries(JSON.parse(raw)).forEach(([ts, cnt]) => {
          const date = new Date(parseInt(ts) * 1000).toISOString().slice(0, 10);
          mergedCalendar[date] = (mergedCalendar[date] || 0) + cnt;
        });
      }
    }

    return res.status(200).json({
      totalSolved:       get("All"),
      easySolved:        get("Easy"),
      mediumSolved:      get("Medium"),
      hardSolved:        get("Hard"),
      ranking:           statsData?.data?.matchedUser?.profile?.ranking ?? null,
      submissionCalendar: mergedCalendar,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}