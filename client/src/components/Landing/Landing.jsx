import "./landing.styles.scss";
import { Link } from "react-router-dom";
import { profileImage } from "../../constants/constants";
import { title, subTitle, text } from "./landingData";

const Landing = () => {
  return (
    <section id="landing" aria-labelledby="landing-title">
      {/* Ambient background orbs */}

      <div className="landing-wrapper">
        {/* TEXT */}
        <div className="text-wrapper">
          <h1 className="heading" id="landing-title">
            {title}
          </h1>
          <h2 className="subtitle">{subTitle}</h2>
          <p className="body">{text}</p>

          <span className="accent-underline" aria-hidden="true" />

          <div className="cta-wrapper">
            <Link to="/courses">Browse Courses</Link>
          </div>
        </div>

        {/* IMAGE */}
        <div className="image-wrapper">
          <div className="image-frame">
            <img
              src={profileImage}
              alt="Kofi portrait"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 980px) 100vw, 520px"
            />
            <div className="image-glow" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
