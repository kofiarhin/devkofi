import "./landing.styles.scss";
import { Link } from "react-router-dom";
import { profileImage } from "../../constants/constants";
import Typewriter from "../TypeWriter/TypeWrite";
import { text, title, subTitle } from "./landingData";

const Landing = () => {
  return (
    <section id="landing">
      <div className="landing-wrapper">
        <div className="text-wrapper">
          <Typewriter title={title} subtitle={subTitle} text={text} />
          <div className="cta-group">
            <a href="/#course-outline" className="cta cta-secondary">
              View Course Outline
            </a>
            <Link to="/register" className="cta">
              Enroll Now
            </Link>
          </div>
          <p className="hero-outcomes">Speed. Precision. Production readiness.</p>
        </div>

        <div className="image-wrapper">
          <img src={profileImage} alt="DevKofi mentor" />
        </div>
      </div>
    </section>
  );
};

export default Landing;
