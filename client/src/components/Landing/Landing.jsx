import "./landing.styles.scss";
import { Link } from "react-router-dom";
import { profileImage } from "../../constants/constants";
import Typewriter from "../TypeWriter/TypeWrite";
import { text, title, subTitle } from "./landingData";

const Landing = () => {
  return (
    <div id="landing">
      <div className="landing-wrapper">
        {/* Text Section */}
        <div className="text-wrapper">
          <Typewriter title={title} subtitle={subTitle} text={text} />
          <Link to="/mentorship" className="cta">
            Get Started!
          </Link>
        </div>

        {/* Image Section */}
        <div className="image-wrapper">
          <img src={profileImage} alt="Profile" />
        </div>
      </div>
    </div>
  );
};

export default Landing;
