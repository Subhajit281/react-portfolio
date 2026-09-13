---
title: Defending Modern Web Apps Against the OWASP Top 10
slug: securing-web-apps-against-owasp-top-10
description: A senior engineer's checklist for mitigating SQL injection, Broken Access Control (IDOR), SSRF, and Cross-Site Scripting (XSS).
author: Subhajit Sarkar
date: 2026-03-29
category: Security
tags: [Security, OWASP, Web Security, Cyber Defense]
coverImage: /blog-covers/owasp-top-10.jpg
keywords: [owasp top 10, web application security, sql injection, broken access control, ssrf prevention, xss mitigation, csp headers]
featured: false
---

# Introduction

Building modern full-stack web applications requires thinking like an attacker. Security can never be an afterthought bolted on right before production deployment; it must be designed into architectural patterns, data access layers, and API gateways.

The **OWASP Top 10** represents the consensus on the most critical security risks facing web applications today. Here is how to systematically defend against them.

## What You'll Learn

- Mitigating **Broken Access Control** (IDOR - Insecure Direct Object References)
- Eliminating SQL & NoSQL injection through parameterized queries
- Preventing **Server-Side Request Forgery (SSRF)** when fetching external URLs
- Hardening browser headers with Content Security Policy (CSP)
- Preventing Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)

## Main Content

### 1. Broken Access Control (IDOR)

Broken Access Control consistently ranks as the #1 vulnerability on the web. It occurs when an application exposes a database key in the URL and trusts the client without validating authorization.

```javascript
// ❌ Vulnerable: Anyone who guesses the invoice ID can download it
app.get("/api/invoices/:id", async (req, res) => {
  const invoice = await db.invoice.findUnique({ where: { id: req.params.id } });
  return res.json(invoice);
});

//  Secure: Scope all queries strictly to the authenticated user/organization
app.get("/api/invoices/:id", authenticateUser, async (req, res) => {
  const invoice = await db.invoice.findFirst({
    where: {
      id: req.params.id,
      organizationId: req.user.organizationId, // Enforce tenant isolation
    },
  });

  if (!invoice) return res.status(404).json({ error: "Invoice not found." });
  return res.json(invoice);
});
```

### 2. Preventing Server-Side Request Forgery (SSRF)

If your app lets users specify webhooks, image URLs, or import feeds, attackers can target cloud metadata servers (`http://169.254.169.254/latest/meta-data/`) or internal loopback networks (`localhost:6379`).

```typescript
import ipaddr from 'ipaddr.js';
import dns from 'node:dns/promises';

async function validateSafePublicUrl(urlString: string): Promise<boolean> {
  const parsed = new URL(urlString);
  if (!['http:', 'https:'].includes(parsed.protocol)) return false;

  // Resolve DNS to underlying IP
  const lookup = await dns.lookup(parsed.hostname);
  const ip = ipaddr.parse(lookup.address);

  // Block private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.1, 169.254.x.x)
  if (ip.range() !== 'unicast') {
    throw new Error('Access to private or link-local network is strictly forbidden.');
  }

  return true;
}
```

### 3. Hardening HTTP Headers

Modern browsers include robust defense mechanisms that must be unlocked via response headers:

```javascript
import helmet from 'helmet';

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://trusted-cdn.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        connectSrc: ["'self'", "https://api.yourdomain.com"],
      },
    },
    crossOriginEmbedderPolicy: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);
```

## Security Checklist Summary

- [ ] Parameterize 100% of database queries with ORMs or prepared statements.
- [ ] Enforce tenant-scoped access control on every database lookup.
- [ ] Validate and block private IPs on user-supplied webhook URLs.
- [ ] Set `SameSite=Strict; HttpOnly; Secure` on all authentication session cookies.
- [ ] Implement rate-limiting at your API gateway (Cloudflare, Nginx, or Redis).

## Conclusion

Security is a continuous posture, not a one-time audit. By incorporating defensive validation, strict tenant scoping, and hardened network boundaries, you protect both your application and your users from catastrophic exploits.

