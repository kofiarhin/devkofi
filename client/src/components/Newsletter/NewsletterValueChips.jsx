import { NEWSLETTER_VALUE_CHIPS } from "./newsletter.constants";

const NewsletterValueChips = () => {
  return (
    <div className="newsletter-chips" aria-label="Newsletter topics">
      {NEWSLETTER_VALUE_CHIPS.map((chip) => (
        <span key={chip} className="newsletter-chip">
          {chip}
        </span>
      ))}
    </div>
  );
};

export default NewsletterValueChips;
