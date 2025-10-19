import React from "react";
import "./privacy-policy.styles.scss";

const PrivacyPolicy = () => {
  return (
    <main className="privacy-policy">
      <header className="privacy-policy-header">
        <h1>Privacy Policy</h1>
        <p className="effective-date">
          <strong>Effective Date:</strong> October 19, 2025
        </p>
      </header>

      <section className="privacy-policy-section">
        <p>
          At <strong>DevKofi.com</strong>, your privacy is important to us. This Privacy Policy explains how we
          collect, use, and protect your information when you visit our website.
        </p>
      </section>

      <section className="privacy-policy-section">
        <h2>1. Information We Collect</h2>
        <ul className="privacy-list">
          <li>
            <strong>Personal Information</strong> — such as your name and email address if you contact us via a form or
            subscribe to updates.
          </li>
          <li>
            <strong>Non-Personal Information</strong> — such as browser type, device information, and pages visited,
            collected automatically through analytics tools (e.g., Google Analytics).
          </li>
        </ul>
      </section>

      <section className="privacy-policy-section">
        <h2>2. How We Use Your Information</h2>
        <ul className="privacy-list">
          <li>Respond to inquiries or messages you send us.</li>
          <li>Improve our website’s content and user experience.</li>
          <li>Send occasional updates or newsletters (only if you’ve opted in).</li>
        </ul>
      </section>

      <section className="privacy-policy-section">
        <h2>3. Cookies</h2>
        <p>
          Our website may use cookies to improve functionality and analyze site usage. You can choose to disable cookies
          through your browser settings.
        </p>
      </section>

      <section className="privacy-policy-section">
        <h2>4. Data Sharing and Security</h2>
        <p>
          We do <strong>not</strong> sell or rent your personal data to third parties.
        </p>
        <p>
          We may share limited data with trusted service providers (e.g., email delivery or analytics tools) who assist
          us in operating the site, under strict confidentiality. All reasonable measures are taken to keep your data
          secure.
        </p>
      </section>

      <section className="privacy-policy-section">
        <h2>5. Third-Party Links</h2>
        <p>
          Our website may contain links to external sites. We are not responsible for the privacy practices or content
          of those sites.
        </p>
      </section>

      <section className="privacy-policy-section">
        <h2>6. Your Rights</h2>
        <ul className="privacy-list">
          <li>Access or correct your personal information.</li>
          <li>Unsubscribe from emails at any time.</li>
          <li>Request deletion of your data by contacting us directly.</li>
        </ul>
      </section>

      <section className="privacy-policy-section">
        <h2>7. Contact Us</h2>
        <p>
          If you have any questions or privacy concerns, please contact:
          <br />
          <strong>Email:</strong> <a href="mailto:devkofi@gmail.com">devkofi@gmail.com</a>
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
