import { Link } from "react-router-dom";
import "./landing.styles.scss";

const Landing = () => {
  return (
    <section className="landing">
      <div className="overlay">
        <div className="text">
          <h1>Hi, I’m Kofi 👋</h1>
          <p>
            A full-stack developer blending code, design, and storytelling to
            build web experiences that are fast, precise, and impactful. I
            specialize in the MERN stack and create apps, tools, and content
            that merge creativity with clean execution.
          </p>
          <div className="actions">
            <Link to="/contact" className="secondary-btn">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
