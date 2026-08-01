import React from "react";

/**
 * Privacy Policy page for subhajit-sarkar.vercel.app
 * Themed to match the site's dark navy/blue aesthetic (glassy cards, white text).
 *
 * BEFORE PUBLISHING — replace these placeholders:
 *   subhajitportfolio018@gmail.com  -> your real contact email
 *   August 1, 2026                  -> date you publish this page
 *   Silchar, India                  -> city/country you operate from
 *
 * If your site's exact blue differs from this dark navy/blue-950 gradient,
 * swap the hex values in the gradient / accent classes below to match.
 *
 * Suggested route: /privacy-policy
 */

const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-[#0a1128] to-blue-950 text-slate-200 px-6 py-16 md:px-20 lg:px-40 relative overflow-hidden pt-27">
      {/* soft glow accents to match glassy site aesthetic */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400 mb-10">
          Effective date: August 1, 2026
        </p>

        <p className="mb-6 leading-relaxed text-slate-300">
          This Privacy Policy explains how Subhajit Sarkar ("I", "me", "my")
          collects, uses, and protects information when you visit{" "}
          <a
            href="https://subhajit-sarkar.vercel.app"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            subhajit-sarkar.vercel.app
          </a>{" "}
          (the "Site"). By using the Site, you agree to the practices
          described below.
        </p>

        <Section title="1. Information I Collect">
          <p className="mb-3">
            <strong className="text-white">Information you provide directly.</strong> If the Site
            includes a contact form, email link, or similar feature, I
            collect whatever information you choose to submit — typically
            your name, email address, and message content.
          </p>
          <p className="mb-3">
            <strong className="text-white">Chatbot conversations.</strong> The Site includes an
            AI-powered chat assistant built on Google's Gemini API. Messages
            you type into the chatbot are sent to Google's servers to
            generate a response. I do not permanently store your chatbot
            conversations on my own servers, but Google processes this data
            under its own privacy terms (see Section 4).
          </p>
          <p>
            <strong className="text-white">Automatically collected information.</strong> Like most
            websites, the Site may automatically log technical data such as
            your IP address, browser type, device type, pages visited, and
            time spent on the Site, typically via cookies or similar
            technologies (see Section 3).
          </p>
        </Section>

        <Section title="2. How I Use Information">
          <ul className="list-disc pl-6 space-y-2">
            <li>To respond to messages sent through the contact form</li>
            <li>To operate and improve the chatbot and other Site features</li>
            <li>To understand how visitors use the Site (analytics)</li>
            <li>To display advertisements (if enabled — see Section 5)</li>
            <li>To maintain the security and performance of the Site</li>
          </ul>
          <p className="mt-3">
            I do not sell your personal information.
          </p>
        </Section>

        <Section title="3. Cookies and Similar Technologies">
          <p className="mb-3">
            Cookies are small text files stored on your device. The Site (or
            third-party services embedded in it, such as analytics or ad
            providers) may use cookies to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li>Remember your preferences</li>
            <li>Understand aggregate visitor behavior</li>
            <li>Serve relevant advertising</li>
          </ul>
          <p>
            You can disable cookies through your browser settings. Doing so
            may affect some Site functionality, but the Site will remain
            usable.
          </p>
        </Section>

        <Section title="4. Third-Party Services">
          <p className="mb-3">
            The Site relies on the following third-party services, each
            governed by its own privacy policy:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-white">Google Gemini API</strong> (powers the chatbot) —{" "}
              <a
                href="https://policies.google.com/privacy"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Privacy Policy
              </a>
            </li>
            <li>
              <strong className="text-white">Google AdSense</strong> (if/when ads are enabled) —
              uses cookies, including the DoubleClick DART cookie, to serve
              ads based on your visits to this and other websites.{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                How Google uses advertising cookies
              </a>
            </li>
            <li>
              <strong className="text-white">Google Analytics</strong> (if enabled) — collects
              anonymized usage statistics.{" "}
              <a
                href="https://policies.google.com/privacy"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Privacy Policy
              </a>
            </li>
            <li>
              <strong className="text-white">Vercel</strong> (hosting) — may log standard server
              request data for security and performance purposes.{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel Privacy Policy
              </a>
            </li>
          </ul>
        </Section>

        <Section title="5. Advertising (Google AdSense)">
          <p className="mb-3">
            This Site may display ads served by Google AdSense and other
            third-party vendors. These vendors may use cookies to serve ads
            based on your prior visits to this Site or other websites on the
            internet.
          </p>
          <p className="mb-3">
            Google's use of advertising cookies enables it and its partners
            to serve ads based on your visits to this Site and/or other
            sites. You may opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>
            . Alternatively, you can opt out of some third-party vendors'
            use of cookies for personalized advertising by visiting{" "}
            <a
              href="https://www.aboutads.info/choices/"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.aboutads.info
            </a>
            .
          </p>
        </Section>

        <Section title="6. Data Sharing and Disclosure">
          <p>
            I do not sell, rent, or trade your personal information. I may
            share information with service providers (such as Google, for
            the chatbot and advertising/analytics) strictly to operate the
            Site, or when required by law, or to protect the rights,
            property, or safety of myself, visitors, or others.
          </p>
        </Section>

        <Section title="7. Data Retention">
          <p>
            Contact form submissions are retained only as long as needed to
            respond to your inquiry. Chatbot messages are processed by
            Google's Gemini API in real time and are not stored long-term on
            my own infrastructure. Analytics and advertising data is
            retained according to the relevant third party's own retention
            policy (see Section 4).
          </p>
        </Section>

        <Section title="8. Your Rights">
          <p className="mb-3">
            Depending on your location, you may have rights under
            applicable data protection laws — including the EU/UK General
            Data Protection Regulation (GDPR), the California Consumer
            Privacy Act (CCPA), and India's Digital Personal Data Protection
            Act, 2023 — to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li>Know what personal information is collected about you</li>
            <li>Request access to or a copy of your information</li>
            <li>Request correction or deletion of your information</li>
            <li>Object to or restrict certain processing</li>
            <li>Opt out of personalized advertising (see Section 5)</li>
          </ul>
          <p>
            To exercise any of these rights, contact me at{" "}
            <a href="mailto:subhajitportfolio018@gmail.com" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
              subhajitportfolio018@gmail.com
            </a>
            .
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            This Site is not directed at children under 13 (or the age of
            digital consent in your jurisdiction), and I do not knowingly
            collect personal information from children. If you believe a
            child has provided personal information through the Site,
            please contact me so I can remove it.
          </p>
        </Section>

        <Section title="10. Data Security">
          <p>
            I take reasonable measures to protect information submitted
            through the Site. However, no method of transmission over the
            internet or electronic storage is 100% secure, and I cannot
            guarantee absolute security.
          </p>
        </Section>

        <Section title="11. International Visitors">
          <p>
            The Site is operated from Silchar, India. If you access the
            Site from outside this location, your information may be
            transferred to, stored, and processed in a different country
            with data protection laws that may differ from those of your
            jurisdiction.
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>
            I may update this Privacy Policy from time to time. Changes will
            be posted on this page with an updated effective date. Continued
            use of the Site after changes are posted constitutes acceptance
            of the revised policy.
          </p>
        </Section>

        <Section title="13. Contact Me">
          <p>
            If you have questions about this Privacy Policy or how your
            information is handled, contact me at{" "}
            <a href="mailto:subhajitportfolio018@gmail.com" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
              subhajitportfolio018@gmail.com
            </a>
            .
          </p>
        </Section>
      </div>
    </main>
  );
};

const Section = ({ title, children }) => (
  <section className="mb-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg shadow-black/20">
    <h2 className="text-xl font-semibold mb-3 text-white">{title}</h2>
    <div className="text-slate-300 leading-relaxed">{children}</div>
  </section>
);

export default PrivacyPolicy;