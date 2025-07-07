import "./landing.styles.scss";

import { Link } from "react-router-dom";
//landing
const Landing = () => {
  return (
    <div id="landing">
      <div className="hero">
        <h1 className="heading">I will help you build + market your app</h1>
        <p>Work with me 1:1 to learn how to build + market your own app</p>
        <Link to="/contact">Get started</Link>
      </div>

      <div className="services">
        <h1 className="heading">Here is what you'll get</h1>
        <div className="services-wrapper">
          <div className="service-unit">
            <h2>Chat</h2>
            <p>
              Message me on Discord as much as you want to get my help on
              building/marketing your SaaS.
            </p>
          </div>

          <div className="service-unit">
            <h2>1-1 Coaching Calls</h2>
            <p>
              We'll hop on a call so you can ask me anything you want about
              building/marketing your SaaS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
