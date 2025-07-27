// src/components/Newsletter.jsx
import "./newsletter.styles.scss";
import { useState } from "react";
import useJoinNewsletterMutation from "../../hooks/useJoinNewsletterMutation";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom";

const Newsletter = () => {
  const navigate = useNavigate();
  const { data, mutate, isPending, isSuccess, error } =
    useJoinNewsletterMutation();
  const [email, setEmail] = useState("colorpalettevault@gmail.com");
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    mutate({ email });
  };

  if (isPending) {
    return <Spinner />;
  }
  if (isSuccess && !data?.error) {
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
        {data && data?.error && <p> {data?.error} </p>}
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
};

export default Newsletter;
