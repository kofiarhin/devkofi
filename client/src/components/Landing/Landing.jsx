import React from "react";
import { profileImage } from "../../constants/constants";
import "./landing.styles.scss";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <section id="landing">
      <div className="landing-content">
        <h2 className="hero-subtitle">DevKofi AI-Powered MERN Stack Mentorship</h2>

        <h1 className="hero-title">
          Build Real MERN Products <br />
          <span className="accent">with AI the Right Way</span>
        </h1>

        <div className="glass-card">
          <p className="hero-description">
            Learn engineering-first workflows for planning, feature scoping, code
            generation, debugging, refactoring, testing, documentation, and
            shipping. This is mentorship for real products, not toy apps.
          </p>

          <div className="cta-group">
            <Link to="/#pricing" className="btn-primary">
              Apply for Mentorship
            </Link>
          </div>
        </div>
      </div>

      <div className="landing-image">
        <div className="image-wrapper">
          <img src={profileImage} alt="DevKofi Mentor" />
          <div className="experience-badge">
            5+
            <span>Years</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
