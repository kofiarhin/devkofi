import React from "react";
import { motion } from "framer-motion";
import "./feature-section.styles.scss";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeatureSection = ({
  title,
  highlightText,
  description,
  buttonText,
  imageSrc,
  reversed = false,
  url = "/register",
  label,
}) => {
  const imageVariants = {
    hidden: { opacity: 0, x: reversed ? 28 : -28 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
    },
  };

  return (
    <section className={`feature-section ${reversed ? "reversed" : ""}`}>
      <div className="feature-inner">
        <motion.div
          className="image-container"
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <img src={imageSrc} alt={title} className="feature-image" />
        </motion.div>

        <motion.div
          className="text-container"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {label && <span className="section-label">{label}</span>}

          <h2 className="title">
            {title}
            <br />
            <span className="highlight">{highlightText}</span>
          </h2>

          <p className="description">{description}</p>

          <Link className="primary-btn" to={url}>
            {buttonText}
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
