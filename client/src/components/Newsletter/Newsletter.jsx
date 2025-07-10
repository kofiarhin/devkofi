// src/components/Newsletter.jsx
import "./newsletter.styles.scss";

const Newsletter = () => {
  return (
    <section className="newsletter">
      <h2>Join Our Newsletter</h2>
      <p>
        Subscribe to get updates, tips, and exclusive content straight to your
        inbox.
      </p>
      <form className="newsletter-form">
        <input type="email" placeholder="Enter your email" required />
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
};

export default Newsletter;
