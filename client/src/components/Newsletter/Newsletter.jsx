// src/components/Newsletter.jsx
import "./newsletter.styles.scss";
import { useState } from "react";
import { motion } from "framer-motion";
import useJoinNewsletterMutation from "../../hooks/useJoinNewsletterMutation";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom";

// Variants
const headingVariant = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const paragraphVariant = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.2 },
  },
};

const formVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 12, delay: 0.4 },
  },
};

const Newsletter = () => {
  const navigate = useNavigate();
  const { data, mutate, isPending, isSuccess, error } =
    useJoinNewsletterMutation();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    mutate({ email });
    setEmail("");
  };

  if (isPending) {
    return <Spinner />;
  }
  if (isSuccess && !data?.error) {
    navigate("/success?type=newsletter");
  }

  return (
    <section id="newsletter">
      {/* Animated Heading */}
      <motion.h1
        className="heading center"
        variants={headingVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        Join Newsletter
      </motion.h1>

      {/* Animated Paragraph */}
      <motion.p
        variants={paragraphVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        Subscribe to get updates, tips, and exclusive content straight to your
        inbox.
      </motion.p>

      {/* Animated Form */}
      <motion.form
        className="newsletter-form"
        onSubmit={handleNewsletterSubmit}
        variants={formVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="input-wrapper">
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {data && data?.error && <p className="text-error">{data?.error}</p>}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Subscribe
        </motion.button>
      </motion.form>
    </section>
  );
};

export default Newsletter;
