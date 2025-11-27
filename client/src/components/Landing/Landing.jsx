import React from "react";
import { profileImage } from "../../constants/constants";
import "./landing.styles.scss";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <section id="landing">
      <div className="container">
        {/* text-wrapper */}
        <div className="text-wrapper">
          <h1 className="heading">Mern stack 2025</h1>
          <h2 className="sub-heading">
            LAND A NEW CAREER WITH NEXT-LEVEL MENTORSHIP
          </h2>
          <p className="slug">
            Yes, you can. Start your journey to a tech car eer in high-demand
            fields like software engineering or data. With expert mentorship and
            hands-on MERN stack training, you can be job-ready in just 6 months.
          </p>
          <Link to="/register" className="cta">
            Register Now!
          </Link>
        </div>
        {/* end text-wrapper */}
        <div className="img-wrapper">
          <img src={profileImage} alt="" />
        </div>
        {/* end img-wrapper */}
      </div>
    </section>
  );
};

export default Landing;
