---
title: OAuth 2.0 & OpenID Connect: The Definitive Developer Guide
slug: oauth2-and-oidc-explained-for-developers
description: Demystifying Authorization Code flow with PKCE, tokens (Access, Refresh, ID), scopes, and securing single-page applications.
author: Subhajit Sarkar
date: 2026-04-05
category: Security
tags: [OAuth2, OIDC, Authentication, Security, JWT]
coverImage: /blog-covers/oauth2-oidc-guide.jpg
keywords: [oauth2 explained, openid connect, pkce flow, authorization code, jwt security, id token vs access token]
featured: true
---

# Introduction

Almost every modern application features a "Sign in with Google" or "Authorize with GitHub" button. Yet behind those simple buttons lies **OAuth 2.0** and **OpenID Connect (OIDC)**—two protocols that are notoriously misunderstood and frequently implemented with subtle security vulnerabilities.

Understanding how authorization code grants, PKCE, and JWT tokens work together is fundamental for building secure, enterprise-grade authentication.

## What You'll Learn

- The fundamental difference between Authentication (OIDC) and Authorization (OAuth 2.0)
- The step-by-step Authorization Code Flow with PKCE (Proof Key for Code Exchange)
- What's inside an ID Token vs an Access Token
- Refresh token rotation and preventing token replay attacks
- Storing tokens safely in browser Single Page Applications (SPAs)

## Main Content

### OAuth 2.0 vs OpenID Connect

- **OAuth 2.0 is for Authorization**: It answers *"What is this application permitted to do on my behalf?"* (e.g. read user repositories). It yields an **Access Token**.
- **OIDC is for Authentication**: It answers *"Who is the user?"*. It sits as an identity layer on top of OAuth 2.0 and yields an **ID Token** (a signed JWT containing profile details like `sub`, `email`, and `name`).

### The Modern Gold Standard: Auth Code Flow with PKCE

Previously, mobile apps and frontend SPAs used the deprecated "Implicit Flow", which exposed tokens directly in URL hash fragments. Today, **Authorization Code Flow with PKCE** is mandatory for all public clients.

```
+--------+                               +---------------+
|        | -- (1) Code Challenge (SHA256) -> | Authorization |
|        | <-- (2) Auth Code -------------- |    Server     |
| Client |                               +---------------+
| (App)  | -- (3) Auth Code + Code Verifier -> | Token Endpoint|
|        | <-- (4) Access Token + ID Token -- |               |
+--------+                               +---------------+
```

1. **Client creates a Code Verifier**: A high-entropy cryptographic random string.
2. **Client computes Code Challenge**: `BASE64URL(SHA256(verifier))` and sends it with the initial redirect to the Authorization Server.
3. User logs in and approves scopes. The server redirects back with an authorization `code`.
4. **Client exchanges code for tokens**: The client sends the authorization `code` along with the raw `code_verifier`. The server hashes the verifier and verifies it matches the original challenge.
5. Even if an attacker intercepted the authorization code in step 2, they cannot exchange it without knowing the client's secret ephemeral `code_verifier`.

### Where to Store Tokens in the Browser

| Storage Strategy | XSS Vulnerability | CSRF Vulnerability | Recommendation |
| :--- | :--- | :--- | :--- |
| **`localStorage`** | ❌ Highly Vulnerable (readable by JS) |  Immune | Never store refresh or access tokens here |
| **`sessionStorage`** | ❌ Vulnerable |  Immune | Avoid for persistent sessions |
| **`HttpOnly; Secure; SameSite=Strict` Cookie** |  Protected from JavaScript | ⚠️ Guard with SameSite and CSRF headers | **Recommended industry standard** |
| **In-Memory + Backend Proxy (BFF)** |  Protected |  Protected | Gold standard for enterprise SPAs |

## Best Practices

- **Validate token signatures**: Never trust JWT claims (`iss`, `aud`, `exp`) without verifying the signature against the identity provider's JWKS endpoint (`/.well-known/jwks.json`).
- **Implement Refresh Token Rotation**: Invalidate old refresh tokens immediately whenever a new access token is minted. If an old token is reused, revoke the entire family immediately.
- **Principle of Least Privilege**: Request only the minimal scopes needed at the time of action (`incremental authorization`).

## Conclusion

By adopting OpenID Connect with PKCE and storing session tokens in secure `HttpOnly` cookies, you protect your users against token hijacking, XSS scraping, and unauthorized privilege escalation.

