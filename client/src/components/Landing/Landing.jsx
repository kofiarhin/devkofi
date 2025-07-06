import "./landing.styles.scss";

import { Link } from "react-router-dom";
//landing
const Landing = () => {
  return (
    <div id="landing">
      <h1 className="heading">Hi There</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
        corporis non ipsa molestiae facilis consequuntur voluptas fugiat ut ex
        unde.
      </p>
      <Link to="/contact">Get in touch</Link>
    </div>
  );
};

export default Landing;
