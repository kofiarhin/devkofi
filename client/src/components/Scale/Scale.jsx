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
            Don't just write code that works—write code that scales. Learn
            enterprise-level patterns, test-driven development (TDD), and cloud
            deployment strategies that top tech companies demand.
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
    </section >
  );
};

export default Scale;
