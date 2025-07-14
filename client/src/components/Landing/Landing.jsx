// src/pages/Landing.jsx
import React from "react";
import "./landing.styles.scss";
import { Link } from "react-router-dom";
import Services from "../Services/Services";

const Landing = () => (
  <div id="landing">
    <h1 className="heading">
      Learn to build and grow your app from idea to launch.
    </h1>
    <p>
      Personalized coaching to master programming, product design, and
      marketing.
    </p>

    <Link className="cta" to="/contact">
      Get started
    </Link>
  </div>
);

export default Landing;
