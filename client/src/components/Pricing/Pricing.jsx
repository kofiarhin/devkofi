import "./pricing.styles.scss";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { pricingData } from "./pricingData";

// Card animation variant
const cardVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
      delay: index * 0.2,
    },
  }),
};

// Section heading animation
const headingVariant = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Pricing = () => {
  return (
    <section className="pricing">
      {/* Animated Heading */}
      <motion.h1
        className="heading center"
        variants={headingVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        Pricing
      </motion.h1>

      {/* Pricing Cards Container */}
      <div className="pricing-container">
        {pricingData.map((plan, index) => (
          <motion.div
            className="pricing-card"
            key={index}
            custom={index}
            variants={cardVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
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
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
