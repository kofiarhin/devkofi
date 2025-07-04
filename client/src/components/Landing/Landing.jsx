import { Link } from "react-router-dom";
import "./landing.styles.scss";

const Landing = () => {
  return (
    <section className="landing">
      <div className="overlay">
        <div className="text">
          <h1>Welcome to Fullstack Template Projects</h1>
          <p>Kickstart your MERN projects with ready-to-use templates.</p>
          <div className="actions">
            <Link to="/templates" className="primary-btn">
              View Templates
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
