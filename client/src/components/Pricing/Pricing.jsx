import React from "react";
import { Link } from "react-router-dom";
import { pricingPlans } from "./pricingData";
import "./pricing.styles.scss";

const Pricing = () => {
  return (
    <section id="pricing">
      <div className="container">
        <div className="header-wrapper">
          <h1 className="heading center">Pricing</h1>
          <p className="section-subtitle">
            Invest in skills that pay off. No hidden fees, just real results.
          </p>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.isPopular ? "popular" : ""}`}
            >
              {plan.isPopular && <div className="badge">Most Popular</div>}

              <div className="card-header">
                <h3 className="plan-title">{plan.title}</h3>
                <div className="price-wrapper">
                  <span className="amount">{plan.price}</span>
                  <span className="frequency">/ {plan.frequency}</span>
                </div>
                <p className="description">{plan.description}</p>
              </div>

              <ul className="features-list">
                {plan.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <span className="check-icon">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="card-footer">
                <Link to="/register" className="cta-button">
                  {plan.ctaText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
