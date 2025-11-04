import React from "react";
import "./landing.styles.scss";
import { title, text, subTitle } from "./landingData";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div id="landing">
      {/* landing-wrapper */}
      <div className="landing-wrapper">
        <h1 className="heading center"> {title} </h1>
        <h2> {subTitle} </h2>
        <p> {text} </p>
        <Link to="/courses" className="cta">
          Browse courses
        </Link>
      </div>
      {/* end landing-wrapper */}
    </div>
  );
};

export default Landing;
