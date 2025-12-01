import { codeBugImage } from "../../constants/constants";
import "./scale.styles.scss";
import { Link } from "react-router-dom";
const Scale = () => {
  return (
    <section id="scale">
      <div className="container">
        {/* text-wrapper */}
        <div className="text-wrapper">
          <h1 className="heading">Write code that scales</h1>
          <p>
            A personalized approach to guidance that adapts to your pace, your
            goals, and your style of learning. Whether you seek direction,
            accountability, or breakthrough strategies, this mentorship is built
            around you—flexible, focused, and designed to unlock your next
            level.
          </p>
          {/* <button className="cta">Join Now</button> */}
          <Link className="cta">Join Now</Link>
        </div>
        {/* end text-wrapper */}

        {/* image-wrapper */}
        <div className="image-wrapper">
          <img src={codeBugImage} alt="" />
        </div>
      </div>
    </section>
  );
};

export default Scale;
