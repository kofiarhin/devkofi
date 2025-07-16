// src/pages/Landing.jsx
import React from "react";
import "./landing.styles.scss";
import { Link } from "react-router-dom";

const Landing = () => (
  <div id="landing">
    <h1 className="heading">Mentorship That Turns Beginners into Builders</h1>
    <p>
      Get the guidance, support, and skills you need to build real-world
      apps—and launch with confidence.
    </p>

    <Link className="cta" to="/mentorship">
      Get Started
    </Link>
  </div>
);

export default Landing;
