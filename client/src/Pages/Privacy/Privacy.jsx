import React from "react";
import "./privacy.styles.scss";

const Privacy = () => {
  return (
    <section className="privacy-page">
      <h1>Privacy Policy</h1>
      <p>Last updated: October 19, 2025</p>

      <p>
        At <strong>DevKofi</strong>, we respect your privacy. This Privacy
        Policy explains how we collect, use, and protect your personal
        information when you use our website and services.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We may collect personal details such as your name, email address, and
        usage data when you interact with our site or subscribe to our services.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>
        Your information is used to improve our services, communicate updates,
        and personalize your experience. We do not sell or share your personal
        data with third parties.
      </p>

      <h2>3. Cookies</h2>
      <p>
        Our website may use cookies to enhance functionality and analyze site
        traffic. You can disable cookies in your browser settings if you prefer.
      </p>

      <h2>4. Data Security</h2>
      <p>
        We take reasonable precautions to protect your data against unauthorized
        access, alteration, or disclosure.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        You may request access, correction, or deletion of your personal
        information at any time by contacting us at{" "}
        <a href="mailto:devkofi@gmail.com">devkofi@gmail.com</a>.
      </p>

      <h2>6. Changes to This Policy</h2>
      <p>
        We may update this policy periodically. Any changes will be reflected on
        this page with an updated date.
      </p>

      <p>By using our site, you agree to the terms of this Privacy Policy.</p>
    </section>
  );
};

export default Privacy;
