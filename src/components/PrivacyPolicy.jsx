// src/components/PrivacyPolicy.jsx
import React from "react";
import PageTransition from "./PageTransition";

/**
 * Privacy Policy page for subhajit-sarkar.vercel.app
 * Reflects full production-grade disclosure for Portfolio Analytics & View Tracking.
 */
const PrivacyPolicy = () => {
  return (
    <PageTransition>
      <main className="text-slate-200 px-6 md:px-20 lg:px-40 py-24 relative z-10">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            Legal & Data Transparency
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-white">
            Privacy <span className="gradient-text-cyan">Policy</span>
          </h1>
          <p className="text-sm font-mono text-slate-400 mb-10">
            Effective Date: October 2026 • Last Updated: October 2, 2026
          </p>

          <p className="mb-6 leading-relaxed text-slate-300">
            This Privacy Policy explains how Subhajit Sarkar ("I", "me", "my")
            collects, uses, and safeguards information when you visit{" "}
            <a
              href="https://subhajit-sarkar.vercel.app"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
            >
              subhajit-sarkar.vercel.app
            </a>{" "}
            (the "Site"). By browsing the Site, you acknowledge the privacy-conscious
            practices described below.
          </p>

          <Section title="1. Information I Collect">
            <p className="mb-3">
              <strong className="text-white">Information You Provide Directly:</strong> If
              you contact me via the contact form or email, I receive the
              details you choose to transmit (such as your name, email address,
              and message content).
            </p>
            <p className="mb-3">
              <strong className="text-white">Chatbot Inquiries:</strong> The Site includes
              an AI assistant powered by Google's Gemini API. Prompts you submit
              are processed server-to-server to generate responses. Chats are
              not sold or permanently retained on my primary servers.
            </p>
            <p>
              <strong className="text-white">Automated Technical & Analytics Data:</strong> To
              understand site reach and engagement, the Site operates an internal
              analytics system that records technical access logs. See Section 2
              for full details.
            </p>
          </Section>

          <Section title="2. Portfolio Visitor Analytics & Tracking">
            <p className="mb-3">
              This portfolio uses an internal, privacy-first analytics system designed
              to measure traffic and geographic reach without tracking you across the internet:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4 text-sm">
              <li>
                <strong className="text-white">Anonymous Visitor Identifier:</strong> An
                opaque random UUID stored locally in your browser (via LocalStorage).
                It contains no personally identifiable data and recognizes returning visits
                without invasive browser fingerprinting.
              </li>
              <li>
                <strong className="text-white">Visit / Session Records:</strong> A session
                ID is generated when you browse. A 30-minute inactivity timeout applies.
                Page refreshes or internal navigation do not create duplicate views.
              </li>
              <li>
                <strong className="text-white">Public IP Address & Geolocation:</strong> Your
                public IP address is captured authoritatively server-side to resolve
                approximate geographical information (Country, Region/State, City, approximate
                coordinates, and ISP).
                <span className="block text-cyan-300 text-xs mt-1">
                  * Notice: Geolocation is strictly approximate IP-based location and NEVER
                  uses precise device GPS or browser location permissions.
                </span>
              </li>
              <li>
                <strong className="text-white">Browser & Device Metadata:</strong> We parse
                the standard User-Agent header to determine general device category
                (Desktop, Mobile, Tablet), browser type, and operating system.
              </li>
              <li>
                <strong className="text-white">Engagement Duration:</strong> A lightweight
                heartbeat (~25s) measures approximate active time spent exploring the portfolio.
                Tracking automatically pauses when you switch tabs or minimize the window.
              </li>
              <li>
                <strong className="text-white">Referrer & Landing Page:</strong> Standard HTTP
                referrer headers indicating how you discovered the portfolio.
              </li>
            </ul>
            <p className="text-sm text-slate-400">
              We do NOT collect names, phone numbers, contacts, cameras, microphones,
              clipboard data, cross-site browsing history, or passwords.
            </p>
          </Section>

          <Section title="3. Third-Party Geolocation Processing">
            <p className="mb-3">
              To resolve approximate country and city information, our backend queries
              a configurable IP geolocation provider (such as ip-api.com).
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm mb-3">
              <li>
                Only the visitor's public IP address is transmitted server-to-server for lookup.
              </li>
              <li>
                Results are cached in memory for 24 hours to minimize external API requests.
              </li>
              <li>
                Lookup failure or provider unavailability never blocks access to the portfolio.
              </li>
            </ul>
          </Section>

          <Section title="4. Cookies & Local Storage">
            <p className="mb-3">
              We use lightweight LocalStorage keys to maintain session state and respect your privacy choices:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm mb-3">
              <li>
                <code className="text-cyan-400 font-mono">portfolio_visitor_id</code>: Opaque UUID
                for unique visitor counting.
              </li>
              <li>
                <code className="text-cyan-400 font-mono">portfolio_session_id</code>: Temporary session
                identifier reset after 30 minutes of inactivity.
              </li>
              <li>
                <code className="text-cyan-400 font-mono">portfolio_analytics_consent</code>: Stores your
                choice (granted / denied).
              </li>
            </ul>
            <p className="text-sm">
              You can clear these keys at any time through your browser's developer tools or settings.
            </p>
          </Section>

          <Section title="5. Data Retention & Automatic TTL Deletion">
            <p className="mb-3">
              We enforce automated technical retention limits directly within our MongoDB database:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong className="text-white">Session Analytics:</strong> Expire and are
                automatically purged by MongoDB background TTL indexes after 90 days
                (configurable).
              </li>
              <li>
                <strong className="text-white">Raw IP Addresses:</strong> Raw IP records are
                subject to scheduled redaction/masking after 30 days to limit long-term storage
                of potential identifiers.
              </li>
            </ul>
          </Section>

          <Section title="6. Your Rights & Consent Choices">
            <p className="mb-3">
              Depending on your jurisdiction (such as GDPR, CCPA, or DPDP Act), you may have rights
              regarding personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm mb-4">
              <li>
                <strong className="text-white">Consent & Withdrawal:</strong> You can accept or
                decline analytics at any time using the on-screen Privacy Notice or Privacy Settings modal.
                Declining immediately halts all tracking and heartbeats.
              </li>
              <li>
                <strong className="text-white">Right to Erasure (Deletion):</strong> You may request
                erasure of analytics sessions associated with your anonymous visitor ID.
              </li>
              <li>
                <strong className="text-white">Data Portability:</strong> You may request an export
                of your recorded session metrics.
              </li>
            </ul>
            <p className="text-sm">
              To submit a request or manage preferences, contact{" "}
              <a
                href="mailto:subhajitsarkar281@gmail.com"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                subhajitsarkar281@gmail.com
              </a>
              .
            </p>
          </Section>

          <Section title="7. Data Security">
            <p className="text-sm leading-relaxed">
              Analytics records are stored securely in an isolated MongoDB database. Analytics endpoints
              are protected by server-side rate-limiting and administrative secret keys. Raw IP addresses
              and internal database metrics are never exposed to public visitors or client-side bundles.
            </p>
          </Section>

          <Section title="8. Contact Information">
            <p className="text-sm">
              For questions regarding this policy or technical data practices:
              <br />
              <strong>Subhajit Sarkar</strong>
              <br />
              Email:{" "}
              <a
                href="mailto:subhajitsarkar281@gmail.com"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                subhajitsarkar281@gmail.com
              </a>
              <br />
              Silchar, Assam, India
            </p>
          </Section>
        </div>
      </main>
    </PageTransition>
  );
};

const Section = ({ title, children }) => (
  <section className="mb-8 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-lg shadow-black/20">
    <h2 className="text-xl font-bold mb-3 text-white flex items-center gap-2">
      <span className="w-1.5 h-4 bg-cyan-400 rounded-full" />
      <span>{title}</span>
    </h2>
    <div className="text-slate-300 leading-relaxed text-sm">{children}</div>
  </section>
);

export default PrivacyPolicy;