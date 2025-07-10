// src/components/Pricing.jsx
import "./pricing.styles.scss";

const Pricing = () => {
  return (
    <section className="pricing">
      <div className="pricing-card">
        <h2>One-off Call</h2>
        <p className="price">£299</p>
        <ul>
          <li>✓ 1-hour call for app advice</li>
          <li>✓ Personalised guidance</li>
          <li>✓ Perfect for quick solutions</li>
          <li>✓ No commitment</li>
          <li>✓ 100% refund guarantee</li>
        </ul>
        <button className="pricing-button">Book a Call</button>
      </div>

      <div className="pricing-card">
        <h2>Monthly Coaching</h2>
        <p className="price">
          £499<span>/month</span>
        </p>
        <ul>
          <li>✓ 1:1 app build + marketing help</li>
          <li>✓ 4 calls per month</li>
          <li>✓ 24/7 messaging access</li>
          <li>✓ 100% refund guarantee</li>
        </ul>
        <button className="pricing-button">Join Today</button>
      </div>
    </section>
  );
};

export default Pricing;
