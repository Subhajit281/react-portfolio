// api/github.js  —  Vercel Serverless Function
// Place at react-portfolio/api/github.js
// Frontend calls: /api/github?username=Subhajit281
// Runs server-side — Vercel's IPs are not rate-limited like browser IPs

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "username is required" });

  const GH_API = "https://api.github.com";
  const headers = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "portfolio-app",
  };

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`${GH_API}/users/${username}`, { headers }),
      fetch(`${GH_API}/users/${username}/repos?per_page=100&sort=pushed`, { headers }),
    ]);

    if (!userRes.ok) throw new Error(`GitHub user API ${userRes.status}`);

    const user  = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];

    const totalStars = Array.isArray(repos)
      ? repos.reduce((a, r) => a + (r.stargazers_count || 0), 0) : 0;

    return res.status(200).json({
      publicRepos: user.public_repos  ?? 0,
      followers:   user.followers     ?? 0,
      following:   user.following     ?? 0,
      totalStars,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}