import { Link } from "react-router-dom";
import "./error.styles.scss";

const Error = () => {
  return (
    <section className="error">
      <div className="card">
        <div className="icon">
          <span>🚫</span>
        </div>
        <h1>Something Went Wrong</h1>
        <p>
          Oops! There was a problem processing your request. Please try again
          later or contact support if the issue persists.
        </p>
        <Link to="/" className="primary-btn">
          Back to Home
        </Link>
      </div>
    </section>
  );
};

export default Error;
