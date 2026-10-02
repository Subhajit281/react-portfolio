// server/dev-server.js  —  LOCAL DEV ONLY
// Mimics Vercel's serverless function routing and URL rewrites for local development.
// Run alongside `npm run dev`: npm run api (or node server/dev-server.js)

import http from "http";
import dotenv from "dotenv";
import lcHandler from "../api/leetcode.js";
import ghHandler from "../api/github.js";
import analyticsHandler from "../api/analytics.js";

// Load local environment variables
dotenv.config();

const PORT = 3001;

function shimRes(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    if (!res.headersSent) res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  };
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Admin-Key");
  return res;
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    req.query = Object.fromEntries(url.searchParams);
    const shimmed = shimRes(res);

    if (req.method === "OPTIONS") {
      res.writeHead(200).end();
      return;
    }

    // Determine target handler
    let handler = null;

    if (url.pathname === "/api/leetcode") {
      handler = lcHandler;
    } else if (url.pathname === "/api/github") {
      handler = ghHandler;
    } else if (url.pathname.startsWith("/api/analytics")) {
      // Map rewrites /api/analytics/(.*) -> endpoint query param
      const subpath = url.pathname.replace(/^\/api\/analytics\/?/, "");
      if (subpath) {
        req.query.endpoint = subpath;
      }
      handler = analyticsHandler;
    }

    if (!handler) {
      res.writeHead(404).end("Not found");
      return;
    }

    // Read body if POST or PUT
    if (req.method === "POST" || req.method === "PUT") {
      let bodyData = "";
      req.on("data", (chunk) => {
        bodyData += chunk;
      });
      req.on("end", () => {
        try {
          req.body = JSON.parse(bodyData);
        } catch {
          req.body = bodyData;
        }
        Promise.resolve(handler(req, shimmed)).catch((err) => {
          console.error(`Error in ${url.pathname}:`, err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    } else {
      req.body = {};
      Promise.resolve(handler(req, shimmed)).catch((err) => {
        console.error(`Error in ${url.pathname}:`, err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }
  })
  .listen(PORT, () => {
    console.log(`✓ Dev server running at http://localhost:${PORT}`);
    console.log(`  /api/leetcode                     →  api/leetcode.js`);
    console.log(`  /api/github                       →  api/github.js`);
    console.log(`  /api/analytics/* (all actions)    →  api/analytics.js (single consolidated function)`);
  });

