import { Link, useLocation } from "react-router-dom";
import "./success.styles.scss";
import { successData } from "./successData";

const Success = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  // Fallback to default message if type is not provided or invalid
  const { heading, slug } = successData[type] || {
    heading: "Thank You for Contacting Me",
    slug: "Your message has been received successfully. I’ll get back to you as soon as possible.",
  };

  return (
    <section className="success">
      <div className="overlay">
        <div className="content">
          <h1>{heading}</h1>
          <p>{slug}</p>
          <Link to="/" className="primary-btn">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Success;
