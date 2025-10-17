import React from "react";
import "./terms-of-use.styles.scss";

const TermsOfUse = ({
  lastUpdated = "January 1, 2024",
  brand = "DevKofi",
  jurisdiction = "Essex",
  city = "London",
  contactEmail = "support@devkofi.com",
  contactAddress = "315 Montgomery St, San Francisco, CA 94104",
}) => (
  <main className="terms-of-use" role="main">
    <header className="terms-of-use-header">
      <h1>{brand} Terms of Use</h1>
      <p>Last updated: {lastUpdated}</p>
    </header>

    <section className="terms-of-use-section">
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using {brand}&apos;s platform, you agree to comply with
        these Terms of Use and any applicable policies referenced herein. If you
        disagree with any part, you must discontinue use immediately.
      </p>
    </section>

    <section className="terms-of-use-section">
      <h2>2. Eligibility</h2>
      <p>
        You confirm that you are at least 18 years old or have parental consent
        to engage with {brand}&apos;s mentorship services. You also warrant that
        you have the legal capacity to enter into this agreement under the laws
        of the {jurisdiction}.
      </p>
    </section>

    <section className="terms-of-use-section">
      <h2>3. Account Responsibilities</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account
        credentials and for all activities that occur under your account. Notify{" "}
        {brand} immediately of any unauthorized use or security breach.
      </p>
      <ul>
        <li>Keep your password secure and update it regularly.</li>
        <li>Use two-factor authentication where available.</li>
        <li>Log out from shared devices when finished.</li>
      </ul>
    </section>

    <section className="terms-of-use-section">
      <h2>4. Platform Usage</h2>
      <p>
        {brand} grants you a limited, non-exclusive, non-transferable license to
        access the platform for mentorship and educational purposes. You agree
        not to misuse the platform or attempt to reverse engineer, copy, or
        resell proprietary content.
      </p>
    </section>

    <section className="terms-of-use-section">
      <h2>5. Payment and Refunds</h2>
      <p>
        All fees for mentorship programs, courses, or digital products must be
        paid in full based on the pricing presented at checkout. Refund requests
        are evaluated according to the applicable program policy communicated
        during enrollment.
      </p>
    </section>

    <section className="terms-of-use-section">
      <h2>6. Content Ownership</h2>
      <p>
        All content, branding, and materials available through {brand} remain
        the intellectual property of
        {brand} or its licensors. You may not reproduce or distribute platform
        materials without prior written consent.
      </p>
    </section>

    <section className="terms-of-use-section">
      <h2>7. User Contributions</h2>
      <p>
        Any content you share, including project submissions or feedback, must
        be accurate, respectful, and lawful. You grant {brand} a non-exclusive
        license to use submitted materials for mentorship delivery and platform
        improvement.
      </p>
    </section>

    <section className="terms-of-use-section">
      <h2>8. Third-Party Services</h2>
      <p>
        The platform may integrate third-party tools or services. {brand} is not
        responsible for the content, policies, or practices of third-party
        providers, and your use of such services is at your own risk.
      </p>
    </section>

    <section className="terms-of-use-section">
      <h2>9. Disclaimers</h2>
      <p>
        The mentorship offerings are provided on an &ldquo;as is&rdquo; basis.{" "}
        {brand} does not guarantee specific outcomes, and any testimonials
        reflect individual experiences. You acknowledge that business and career
        results vary.
      </p>
    </section>

    <section className="terms-of-use-section">
      <h2>10. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law in the {jurisdiction}, {brand} is
        not liable for indirect, incidental, special, or consequential damages
        arising from your use of the platform.
      </p>
    </section>

    <section className="terms-of-use-section">
      <h2>11. Governing Law and Dispute Resolution</h2>
      <p>
        These terms are governed by the laws of the {jurisdiction}. Any disputes
        will be resolved in the courts located in {city}, unless both parties
        agree to alternative dispute resolution methods.
      </p>
    </section>

    <section className="terms-of-use-section terms-of-use-contact">
      <h2>Contact</h2>
      <p>
        For questions about these terms or {brand}&apos;s services, reach out
        using the following contact details:
      </p>
      <ul>
        {contactEmail && (
          <li>
            Email: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </li>
        )}
      </ul>
    </section>
  </main>
);

export default TermsOfUse;
