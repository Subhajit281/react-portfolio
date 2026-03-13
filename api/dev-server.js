// api/dev-server.js  —  LOCAL DEV ONLY
// Mimics Vercel's serverless function routing for local development.
// Run alongside `npm run dev`: node api/dev-server.js

import http from "http";
import lcHandler from "./leetcode.js";
import ghHandler from "./github.js";

const PORT = 3001;

function shimRes(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json   = (data) => {
    if (!res.headersSent) res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  };
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res;
}

http.createServer((req, res) => {
  const url    = new URL(req.url, `http://localhost:${PORT}`);
  req.query    = Object.fromEntries(url.searchParams);
  const shimmed = shimRes(res);

  if (url.pathname === "/api/leetcode") {
    Promise.resolve(lcHandler(req, shimmed)).catch((err) => {
      console.error("LC handler error:", err);
      if (!res.headersSent) { res.statusCode = 500; res.end(JSON.stringify({ error: err.message })); }
    });
  } else if (url.pathname === "/api/github") {
    Promise.resolve(ghHandler(req, shimmed)).catch((err) => {
      console.error("GH handler error:", err);
      if (!res.headersSent) { res.statusCode = 500; res.end(JSON.stringify({ error: err.message })); }
    });
  } else {
    res.writeHead(404).end("Not found");
  }
}).listen(PORT, () => {
  console.log(`✓ Dev proxy running at http://localhost:${PORT}`);
  console.log(`  /api/leetcode  →  leetcode.js`);
  console.log(`  /api/github    →  github.js`);
});