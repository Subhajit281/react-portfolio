// api/dev-server.js  —  LOCAL DEV ONLY
// Mimics Vercel's serverless function routing for local development.
// Run alongside `npm run dev`: node api/dev-server.js

import http from "http";
import dotenv from "dotenv";
import lcHandler from "./leetcode.js";
import ghHandler from "./github.js";
import analyticsStartHandler from "./analytics/session/start.js";
import analyticsHeartbeatHandler from "./analytics/session/heartbeat.js";
import analyticsEndHandler from "./analytics/session/end.js";
import analyticsManageHandler from "./analytics/manage.js";

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

const routes = {
  "/api/leetcode": lcHandler,
  "/api/github": ghHandler,
  "/api/analytics/session/start": analyticsStartHandler,
  "/api/analytics/session/heartbeat": analyticsHeartbeatHandler,
  "/api/analytics/session/end": analyticsEndHandler,
  "/api/analytics/manage": analyticsManageHandler,
};

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    req.query = Object.fromEntries(url.searchParams);
    const shimmed = shimRes(res);

    if (req.method === "OPTIONS") {
      res.writeHead(200).end();
      return;
    }

    const handler = routes[url.pathname];
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
    console.log(`  /api/leetcode                     →  leetcode.js`);
    console.log(`  /api/github                       →  github.js`);
    console.log(`  /api/analytics/session/start      →  analytics/session/start.js`);
    console.log(`  /api/analytics/session/heartbeat  →  analytics/session/heartbeat.js`);
    console.log(`  /api/analytics/session/end        →  analytics/session/end.js`);
    console.log(`  /api/analytics/manage             →  analytics/manage.js`);
  });