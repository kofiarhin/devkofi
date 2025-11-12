import React from "react";
import pricingData from "./pricingData";
import "./pricing.styles.scss";

const formatPrice = (amount, currency) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(
    amount
  );

const Pricing = () => {
  const { pricing_strategy, single_course_offers } = pricingData;
  const { single_course, memberships } = pricing_strategy;

  return (
    <section className="pricing">
      <header className="pricing-header">
        <h1 className="heading center">Pricing</h1>
      </header>

      <div className="plan-list">
        {/* One-Time Course Plans */}
        {single_course_offers.map((course) => (
          <article key={course.id} className="plan-card one-time">
            <h3 className="plan-name">{course.name}</h3>

            <div className="plan-price-wrap">
              <span className="plan-price">
                {formatPrice(course.price.amount, course.price.currency)}
              </span>
              <span className="plan-cycle">(one-time)</span>
            </div>

            <ul className="plan-features">
              {single_course.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <a href={course.links.buy} className="cta">
              Join{" "}
              {course.name.includes("Mentorship") ? "Mentorship" : "Course"}
            </a>
          </article>
        ))}

        {/* Membership Plans */}
        {memberships.map((plan, index) => (
          <article key={index} className={`plan-card ${plan.billing_cycle}`}>
            <h3 className="plan-name">{plan.name}</h3>

            <div className="plan-price-wrap">
              <span className="plan-price">
                {formatPrice(plan.price, plan.currency)}
              </span>
              <span className="plan-cycle">
                ({plan.billing_cycle === "monthly" ? "per month" : "per year"})
              </span>
            </div>

            {plan.discount && (
              <div className="badge">
                {plan.discount.code}: First year{" "}
                {formatPrice(plan.discount.first_year_price, plan.currency)}
              </div>
            )}

            <ul className="plan-features">
              {plan.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            {plan.notes && <p className="plan-notes">{plan.notes}</p>}

            <button className="cta">
              {plan.billing_cycle === "monthly" ? "Go Pro" : "Go VIP"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
