import {
  NEWSLETTER_BODY,
  NEWSLETTER_CARD_COPY,
  NEWSLETTER_CARD_TITLE,
  NEWSLETTER_EYEBROW,
  NEWSLETTER_FEATURED_IMAGE,
  NEWSLETTER_HEADLINE,
  NEWSLETTER_TRUST_PRIMARY,
  NEWSLETTER_TRUST_SECONDARY,
  NEWSLETTER_VISUAL_BADGE,
} from "./newsletter.constants";
import NewsletterSignupForm from "./NewsletterSignupForm";
import NewsletterValueChips from "./NewsletterValueChips";
import "./newsletter.styles.scss";

const Newsletter = () => {
  return (
    <section
      className="newsletter-section"
      aria-labelledby="newsletter-title"
    >
      <div className="newsletter-shell">
        <div className="newsletter-layout">
          <div className="newsletter-story">
            <div className="newsletter-media">
              <img
                src={NEWSLETTER_FEATURED_IMAGE}
                alt="DevKofi builder portrait"
                loading="lazy"
              />
              <div className="newsletter-media-badge">{NEWSLETTER_VISUAL_BADGE}</div>
            </div>

            <div className="newsletter-copy">
              <p className="newsletter-eyebrow">{NEWSLETTER_EYEBROW}</p>
              <h3 id="newsletter-title" className="newsletter-title">
                {NEWSLETTER_HEADLINE}
              </h3>
              <p className="newsletter-description">{NEWSLETTER_BODY}</p>
              <NewsletterValueChips />
            </div>
          </div>

          <aside className="newsletter-card" aria-label="Newsletter signup panel">
            <div className="newsletter-card-header">
              <div className="newsletter-card-icon" aria-hidden="true">
                <span className="newsletter-card-icon-core" />
              </div>

              <div>
                <p className="newsletter-card-eyebrow">Builder signal</p>
                <h4 className="newsletter-card-title">{NEWSLETTER_CARD_TITLE}</h4>
                <p className="newsletter-card-copy">{NEWSLETTER_CARD_COPY}</p>
              </div>
            </div>

            <NewsletterSignupForm />

            <div className="newsletter-trust">
              <p className="newsletter-trust-primary">{NEWSLETTER_TRUST_PRIMARY}</p>
              <p className="newsletter-trust-secondary">{NEWSLETTER_TRUST_SECONDARY}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
