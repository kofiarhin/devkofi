import React from "react";
import "./pricing.styles.scss";

const Pricing = () => {
  const plans = [
    {
      title: "Foundational Coder",
      price: "£99",
      desc: "Build essential skills",
      features: [
        "Access to core courses",
        "Weekly live streams",
        "Community forum access",
      ],
      buttonText: "Start Free Trial",
      isPopular: false,
    },
    {
      title: "Pro Developer",
      price: "£199",
      desc: "Accelerate your career growth",
      features: [
        "ALL Foundational features",
        "Personalized mentorship",
        "Project feedback",
        "Priority support",
      ],
      buttonText: "Upgrade to Pro",
      isPopular: true,
    },
    {
      title: "Enterprise Team",
      price: "£499",
      desc: "For teams up to 10 members",
      features: [
        "ALL Pro features",
        "Dedicated team account",
        "Custom curriculum support",
        "Success manager",
      ],
      buttonText: "Request Demo",
      isPopular: false,
    },
  ];

  return (
    <section className="pricing-section">
      <div className="pricing-header">
        <h2 className="pricing-title">Unlock Your Potential</h2>
        <p className="pricing-subtitle">Choose plan that fits your ambition.</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`pricing-card ${plan.isPopular ? "is-popular" : ""}`}
          >
            {plan.isPopular && (
              <span className="popular-badge">MOST POPULAR</span>
            )}

            <h3 className="card-title">{plan.title}</h3>
            <div className="card-price">
              {plan.price}
              <span>/month</span>
            </div>
            <p className="card-description">{plan.desc}</p>

            <ul className="card-features">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>

            <button
              className={`card-button ${plan.isPopular ? "btn-primary" : ""}`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
