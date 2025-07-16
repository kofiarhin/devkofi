// src/pages/Landing.jsx
import React from "react";
import "./landing.styles.scss";
import { Link } from "react-router-dom";

const Landing = () => (
  <div id="landing">
    <h1 className="heading">
      Build Real-World Coding Skills with Expert Guidance
    </h1>
    <p>
      Personalized mentorship to help you master programming, design real
      projects, and grow from idea to launch
    </p>

    <Link className="cta" to="/contact">
      Get started
    </Link>
  </div>
);

export default Landing;
