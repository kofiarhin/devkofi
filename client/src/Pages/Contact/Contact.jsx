import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Envelope,
  GithubLogo,
  LinkedinLogo,
  Clock,
  WarningCircle,
  XLogo,
} from "@phosphor-icons/react";
import useContactMutation from "../../hooks/useContactMutation";
import "./contact.styles.scss";

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
};

const Contact = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const { mutate, isPending, isSuccess, isError, error, reset } = useContactMutation();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    reset();
  };

  return (
    <div className="contact-page">
      <div className="contact-orb contact-orb--1" aria-hidden="true" />
      <div className="contact-orb contact-orb--2" aria-hidden="true" />

      <div className="contact-inner">
        {/* ── Left panel ── */}
        <motion.div
          className="contact-left"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="contact-eyebrow" variants={item}>
            <span className="eyebrow-dot" aria-hidden="true" />
            Get in touch
          </motion.div>

          <motion.h1 className="contact-heading" variants={item}>
            Let's build something
            <span>great together.</span>
          </motion.h1>

          <motion.p className="contact-desc" variants={item}>
            Have a project in mind, a question, or just want to say hi? Drop me
            a message — I read every one and reply within 24 hours.
          </motion.p>

          <motion.div className="contact-details" variants={item}>
            <div className="contact-detail-item">
              <div className="detail-icon">
                <Envelope size={16} weight="duotone" />
              </div>
              <div>
                <strong>Email</strong>
                <span>kofiarhin69@gmail.com</span>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="detail-icon">
                <Clock size={16} weight="duotone" />
              </div>
              <div>
                <strong>Response time</strong>
                <span>Within 24 hours</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="contact-socials" variants={item}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <GithubLogo size={14} weight="fill" />
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedinLogo size={14} weight="fill" />
              LinkedIn
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter / X"
            >
              <XLogo size={14} weight="fill" />
              Twitter
            </a>
          </motion.div>
        </motion.div>

        {/* ── Right panel — form card ── */}
        <motion.div
          className="contact-card"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.2 }}
        >
          {isSuccess ? (
            <div className="contact-success">
              <div className="success-icon-wrap">
                <CheckCircle size={32} weight="duotone" />
              </div>
              <h3>Message sent!</h3>
              <p>
                Thanks for reaching out. I'll get back to you within 24 hours.
              </p>
              <button className="success-reset" onClick={handleReset}>
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              {isError && (
                <div className="contact-feedback contact-feedback--error" role="alert">
                  <WarningCircle
                    size={18}
                    weight="duotone"
                    className="feedback-icon"
                  />
                  <span>
                    <strong>Failed to send.</strong>{" "}
                    {error?.message ?? "Something went wrong. Please try again."}
                  </span>
                </div>
              )}

              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell me more…"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-submit"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="submit-spinner" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight size={16} weight="bold" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
