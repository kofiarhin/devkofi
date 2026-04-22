import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, EnvelopeSimple } from "@phosphor-icons/react";
import { baseUrl } from "../../constants/constants";
import "./newsletter.styles.scss";

const spring = { type: "spring", stiffness: 100, damping: 20 };

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus({ state: "loading", message: "" });

    try {
      const res = await fetch(`${baseUrl}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setStatus({ state: "success", message: data.message || "Thanks for subscribing!" });
      setEmail("");
    } catch (err) {
      setStatus({ state: "error", message: err?.message || "Failed to subscribe." });
    }
  };

  const isLoading = status.state === "loading";
  const isSuccess = status.state === "success";

  return (
    <motion.section
      className="newsletter-section"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ ...spring, duration: 0.6 }}
    >
      <div className="newsletter-inner">
        <div className="newsletter-icon-wrap">
          <EnvelopeSimple size={22} weight="duotone" aria-hidden="true" />
        </div>

        <div className="newsletter-copy">
          <h3 className="newsletter-title">Weekly dev insights</h3>
          <p className="newsletter-subtitle">
            MERN tips, AI workflows, and career moves — straight to your inbox.
            No spam.
          </p>
        </div>

        {isSuccess ? (
          <p className="newsletter-success">{status.message}</p>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              className="newsletter-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="email"
            />
            <button
              type="submit"
              className="newsletter-btn"
              disabled={isLoading || !email.trim()}
              aria-label="Subscribe to newsletter"
            >
              {isLoading ? (
                <span className="newsletter-spinner" aria-hidden="true" />
              ) : (
                <ArrowRight size={18} weight="bold" aria-hidden="true" />
              )}
            </button>
          </form>
        )}

        {status.state === "error" && (
          <p className="newsletter-error">{status.message}</p>
        )}
      </div>
    </motion.section>
  );
};

export default Newsletter;
