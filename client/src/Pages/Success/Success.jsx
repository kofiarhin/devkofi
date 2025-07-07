import { Link } from "react-router-dom";
import "./success.styles.scss";

const Success = () => {
  return (
    <section className="success">
      <div className="overlay">
        <div className="content">
          <h1>🎉 Message Sent!</h1>
          <p>
            Thank you for reaching out. I’ll get back to you as soon as
            possible.
          </p>
          <Link to="/" className="primary-btn">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Success;
