import React from "react";
import "./privacy.styles.scss";

const sections = [
  { id: "info-we-collect", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use Your Information" },
  { id: "cookies", label: "Cookies" },
  { id: "data-security", label: "Data Security" },
  { id: "your-rights", label: "Your Rights" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact" },
];

const Privacy = () => {
  return (
    <main className="privacy-page" aria-labelledby="privacy-title">
      <aside className="toc" aria-label="On this page">
        <p className="toc-title">On this page</p>
        <nav>
          <ul className="toc-list">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <article className="content">
        <header className="header">
          <h1 id="privacy-title">Privacy Policy</h1>
          <p className="meta">Last updated: October 19, 2025</p>
          <p>
            At <strong>DevKofi</strong>, we respect your privacy. This Privacy
            Policy explains how we collect, use, and protect your personal
            information when you use our website and services.
          </p>
        </header>

        <section id="info-we-collect" className="section">
          <h2>1. Information We Collect</h2>
          <p>
            We may collect personal details such as your name, email address,
            and usage data when you interact with our site or subscribe to our
            services.
          </p>
        </section>

        <section id="how-we-use" className="section">
          <h2>2. How We Use Your Information</h2>
          <p>
            Your information is used to improve our services, communicate
            updates, and personalize your experience. We do not sell or share
            your personal data with third parties.
          </p>
        </section>

        <section id="cookies" className="section">
          <h2>3. Cookies</h2>
          <p>
            Our website may use cookies to enhance functionality and analyze
            site traffic. You can disable cookies in your browser settings if
            you prefer.
          </p>
        </section>

        <section id="data-security" className="section">
          <h2>4. Data Security</h2>
          <p>
            We take reasonable precautions to protect your data against
            unauthorized access, alteration, or disclosure.
          </p>
        </section>

        <section id="your-rights" className="section">
          <h2>5. Your Rights</h2>
          <p>
            You may request access, correction, or deletion of your personal
            information at any time by contacting us.
          </p>
        </section>

        <section id="changes" className="section">
          <h2>6. Changes to This Policy</h2>
          <p>
            We may update this policy periodically. Any changes will be
            reflected on this page with an updated date.
          </p>
        </section>

        <section id="contact" className="section">
          <h2>7. Contact</h2>
          <p>
            Email: <a href="mailto:devkofi@gmail.com">devkofi@gmail.com</a>
          </p>
        </section>

        <a
          className="back-to-top"
          href="#privacy-title"
          aria-label="Back to top"
        >
          ↑ Back to top
        </a>
      </article>
    </main>
  );
};

export default Privacy;
