import React from "react";
import { Link } from "react-router-dom"; // Added Link
import "./pricing.styles.scss";

const Pricing = () => {
  const plans = [
    {
      title: "Full-Stack Bootcamp: Standard",
      price: "£1,200",
      duration: "/ one-time",
      desc: "Perfect for self-starters who want structure and community.",
      features: [
        "6-month full-stack web development bootcamp",
        "Weekly live sessions & lifetime recordings",
        "10+ real-world portfolio projects",
        "Private student community",
        "End-of-course certificate",
        "14-day refund guarantee",
      ],
      buttonText: "Join Standard",
      isPopular: false,
    },
    {
      title: "Full-Stack Bootcamp: Pro",
      price: "£1,800",
      duration: "/ one-time",
      desc: "For those who want hands-on accountability and faster growth.",
      features: [
        "All Standard features included",
        "Bi-weekly 1:1 mentorship sessions",
        "Detailed code reviews & feedback",
        "Personalized portfolio & career guidance",
        "Priority Slack/Discord support",
        "14-day refund guarantee",
      ],
      buttonText: "Go Pro",
      isPopular: true,
    },
    {
      title: "Team / Enterprise",
      price: "£5,000",
      duration: "/ up to 5 members",
      desc: "Upskill your small team with dedicated support.",
      features: [
        "Team access & custom scheduling",
        "Team-focused real-world projects",
        "Dedicated instructor support",
        "Post-course team audit & recommendations",
        "Private Slack channel for your team",
        "14-day refund guarantee",
      ],
      buttonText: "Request Access",
      isPopular: false,
    },
  ];

  return (
    <section className="pricing-section">
      <div className="pricing-header">
        <h2 className="pricing-main-title">Pricing</h2>
        <p className="pricing-subtitle">
          Invest in skills that pay off. No hidden fees, just real results.
        </p>
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

            <div className="card-top">
              <h3 className="card-title">{plan.title}</h3>
              <div className="card-price">
                {plan.price} <span className="duration">{plan.duration}</span>
              </div>
              <p className="card-description">{plan.desc}</p>
            </div>

            <ul className="card-features">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>

            {/* Replaced button with Link */}
            <Link
              to="/register"
              className={`card-button ${
                plan.isPopular ? "btn-highlight" : "btn-outline"
              }`}
            >
              {plan.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
