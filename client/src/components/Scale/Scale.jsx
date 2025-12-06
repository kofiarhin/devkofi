import { codeBugImage } from "../../constants/constants";
import "./scale.styles.scss";
import { Link } from "react-router-dom";
const Scale = () => {
  return (
    <section id="scale">
      <div className="bg-glow two"></div>
      <div className="scale-wrapper">
        {/* text-wrapper */}
        <div className="text-wrapper">
          <h1 className="heading">Write code <span className="text-gradient">that scales</span></h1>
          <p>
            A personalized approach to guidance that adapts to your pace, your
            goals, and your style of learning. Whether you seek direction,
            accountability, or breakthrough strategies, this mentorship is built
            around you—flexible, focused, and designed to unlock your next
            level.
          </p>
          {/* <button className="cta">JoinPmPPPPPPPPPPPPPP~` Now</button> */}
          <Link className="cta primary-cta">Join Now</Link>
        </div>
        {/* end text-wrapper */}

        {/* image-wrapper */}
        <div className="image-wrapper">
          <div className="glass-card">
            <img src={codeBugImage} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Scale;
