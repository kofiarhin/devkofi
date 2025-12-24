import React from "react";
import "./feature-section.styles.scss";
import { Link } from "react-router-dom";

const FeatureSection = ({
  title,
  highlightText,
  description,
  buttonText,
  onButtonClick,
  imageSrc,
  reversed = false,
  url = "/register",
}) => {
  return (
    <section className={`feature-section ${reversed ? "reversed" : ""}`}>
      <div className="container">
        <div className="content-wrapper">
          <div className="image-container">
            <img src={imageSrc} alt={title} className="feature-image" />
          </div>

          <div className="text-container">
            <h2 className="title">
              {title} <br />
              <span className="highlight">{highlightText}</span>
            </h2>
            <p className="description">{description}</p>
            <Link className="primary-btn" to={url}>
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
