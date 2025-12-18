import React from "react";
import { profileImage } from "../../constants/constants";
import "./landing.styles.scss";

const Landing = () => {
  return (
    <section id="landing">
      <div className="landing-content">
        <h1 className="hero-title">
          MERN Stack <br />
          <span className="accent">Development 2026</span>
        </h1>

        <h2 className="hero-subtitle">
          LAND A HIGH-PAYING CAREER WITH <br />
          NEXT-LEVEL MENTORSHIP
        </h2>

        <p className="hero-description">
          Dive into cutting-edge technologies. Start your journey to a career in
          high-demand MERN stack development. Build a portfolio-ready project in
          just 6 months.
        </p>

        <div className="cta-group">
          <button className="btn-primary">Start Your Journey</button>
          <button className="btn-secondary">View Curriculum</button>
        </div>
      </div>

      <div className="landing-image">
        <div className="image-card">
          <img src={profileImage} alt="DevKofi Mentor" />
          <div className="experience-tag">5+ Years Exp.</div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
