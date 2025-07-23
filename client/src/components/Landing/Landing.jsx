import "./landing.styles.scss";
import profileImage from "../../assets/img/profile-small.png";
import { Link } from "react-router-dom";
const Landing = () => {
  return (
    <div id="landing">
      <div className="landing-wrapper">
        <div className="text-wrapper">
          <h1 className="heading">
            LAND A NEW CAREER WITH NEXT-LEVEL MENTORSHIP
          </h1>
          <p>
            Yes, you can. Start your journey to a tech career in high-demand
            fields like software engineering or data. With expert mentorship and
            hands-on MERN stack training, you can be job-ready in just 6 months.
          </p>
          <Link to="/mentorship"> Get Started!</Link>
        </div>
        <div className="img-wrapper">
          <img src={profileImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Landing;
