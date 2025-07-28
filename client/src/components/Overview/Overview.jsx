import "./overview.styles.scss";
// overview
import { Link } from "react-router-dom";

const Overview = () => {
  return (
    <div id="overview">
      <div className="overview-wrapper">
        <div className="image-wrapper">
          <img
            src="https://res.cloudinary.com/dlsiabgiw/image/upload/v1753669719/devkofi/tri8gqr0qksux018d1bj.png"
            alt=""
          />
        </div>
        <div className="text-wrapper">
          <h1 className="heading">
            Your Mentorship....<span>Your way.... </span>
          </h1>
          <p>
            A personalized approach to guidance that adapts to your pace, your
            goals, and your style of learning. Whether you seek direction,
            accountability, or breakthrough strategies, this mentorship is built
            around you—flexible, focused, and designed to unlock your next level
          </p>
          <Link to="/mentorship">Join Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Overview;
