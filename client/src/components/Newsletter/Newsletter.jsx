// src/components/Newsletter.jsx
import "./newsletter.styles.scss";
import { useState } from "react";
import useJoinNewsletterMutation from "../../hooks/useJoinNewsletterMutation";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom";

const Newsletter = () => {
  const navigate = useNavigate();
  const { data, mutate, isPending, isSuccess } = useJoinNewsletterMutation();
  const [email, setEmail] = useState("");
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    mutate({ email });
  };

  if (isPending) {
    return <Spinner />;
  }
  if (isSuccess) {
    navigate("/success");
  }
  return (
    <section className="newsletter">
      <h2>Join Newsletter</h2>
      <p>
        Subscribe to get updates, tips, and exclusive content straight to your
        inbox.
      </p>
      <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
};

export default Newsletter;
