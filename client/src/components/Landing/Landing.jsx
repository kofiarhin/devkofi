import React from "react";
import { profileImage } from "../../constants/constants";
import "./landing.styles.scss";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <section id="landing">
      <div className="landing-content">
        <h2 className="hero-subtitle">Next-Level MERN Mentorship</h2>

        <h1 className="hero-title">
          MERN Stack <br />
          <span className="accent">Development 2026</span>
        </h1>

        <div className="glass-card">
          <p className="hero-description">
            Stop watching tutorials and start building production-grade apps.
            Master the stack used by the world's fastest-growing startups with
            direct mentorship from DevKofi.
          </p>

          <div className="cta-group">
            <Link to="/register" className="btn-primary">
              Start Your Journey
            </Link>
            {/* <button className="btn-secondary">View Curriculum</button> */}
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
