import React from "react";
import { motion } from "framer-motion";
import "./feature-section.styles.scss";
import { Link } from "react-router-dom";

const FeatureSection = ({
  title,
  highlightText,
  description,
  buttonText,
  imageSrc,
  reversed = false,
  url = "/register",
}) => {
  const imageVariants = {
    hidden: { opacity: 0, x: reversed ? 26 : -26 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: reversed ? -22 : 22, y: 10 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.18 },
    },
  };

  return (
    <section className={`feature-section ${reversed ? "reversed" : ""}`}>
      <div className="container">
        <div className="content-wrapper">
          <motion.div
            className="image-container"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
          >
            <img src={imageSrc} alt={title} className="feature-image" />
          </motion.div>

          <motion.div
            className="text-container"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h2 className="title">
              {title} <br />
              <span className="highlight">{highlightText}</span>
            </h2>
            <p className="description">{description}</p>
            <motion.div variants={buttonVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.7 }}>
              <Link className="primary-btn" to={url}>
                {buttonText}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
