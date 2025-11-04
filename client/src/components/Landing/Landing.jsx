import React from "react";
import { Link } from "react-router-dom";
import "./landing.styles.scss";
import { title, text, subTitle } from "./landingData";

const Landing = () => {
  return (
    <section id="landing">
      <div className="hero">
        <div className="hero-card">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-subtitle">{subTitle}</p>
          <p className="hero-text">{text}</p>
          <div className="hero-actions">
            <Link to="/courses" className="cta-primary">
              Browse courses
            </Link>
          </div>
        </div>

        <div
          className="hero-visual"
          aria-hidden="true"
          /* set a custom image via CSS var in :root or #landing
             e.g. --hero-image-url: url('/images/learner.png'); */
        />
      </div>
    </section>
  );
};

export default Landing;
