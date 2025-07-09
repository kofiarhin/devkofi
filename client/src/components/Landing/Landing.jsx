// src/pages/Landing.jsx
import React from "react";
import "./landing.styles.scss";
import { Link } from "react-router-dom";
import Services from "../Services/Services";

const Landing = () => (
  <div id="landing">
    <div className="hero">
      <h1 className="heading">I help you build & market your SaaS app</h1>
      <p>1:1 coaching to launch faster and reach real users</p>
      <Link className="cta" to="/contact">
        Get started
      </Link>
    </div>
  </div>
);

export default Landing;
