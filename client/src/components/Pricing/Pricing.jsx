import "./pricing.styles.scss";
import { Link } from "react-router-dom";
import { pricingData } from "./pricingData";

const Pricing = () => {
  return (
    <section className="pricing">
      <h1 className="heading center">Pricing</h1>
      <div className="pricing-container">
        {pricingData.map((plan, index) => (
          <div className="pricing-card" key={index}>
            <h2>{plan.title}</h2>
            <p className="price">
              {plan.price}
              {plan.priceSuffix && <span>{plan.priceSuffix}</span>}
            </p>
            <ul>
              {plan.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
            {plan.button.external ? (
              <a
                href={plan.button.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pricing-button"
              >
                {plan.button.text}
              </a>
            ) : (
              <Link to="/mentorship" className="pricing-button">
                {plan.button.text}
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
