import React from "react";
import { profileImage } from "../../constants/constants";
import "./landing.styles.scss";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <section id="landing">
      {/* Background Elements */}
      <div className="bg-glow one"></div>
      <div className="bg-glow two"></div>

      <div className="container">
        {/* text-wrapper */}
        <div className="text-wrapper">
          <h1 className="heading">
            MERN Stack <br />
            <span className="highlight-gradient">Development 2025</span>
          </h1>
          <h2 className="sub-heading">
            Land a <span className="text-highlight">High-Paying</span> Career with <br />
            Next-Level Mentorship
          </h2>
          <p className="slug">
            Stop learning in isolation. Start your journey to a tech career in high-demand
            fields like software engineering. With expert mentorship and
            hands-on MERN stack training, you can be job-ready in just <span className="fw-bold">6 months</span>.
          </p>
          <div className="cta-wrapper">
            <Link to="/register" className="cta primary-cta">
              Start Your Journey
            </Link>
            <a href="#courses" className="cta secondary-cta">
              View Curriculum
            </a>
          </div>
        </div>
        {/* end text-wrapper */}

        <div className="img-wrapper">
          <div className="glass-card">
            <img src={profileImage} alt="DevKofi Mentor" />
            <div className="badge-experience">
              <span>🚀</span> 5+ Years Exp.
            </div>
          </div>
        </div>
        {/* end img-wrapper */}
      </div>
    </section>
  );
};

export default Landing;
