import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Envelope,
  GithubLogo,
  LinkedinLogo,
  PaperPlaneTilt,
  Sparkle,
  WarningCircle,
  XLogo,
} from "@phosphor-icons/react";
import useContactMutation from "../../hooks/useContactMutation";
import "./contact.styles.scss";

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

const contactEmail = "kofiarhin69@gmail.com";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
};

const projectPrompts = [
  "Portfolio site",
  "MVP build",
  "Dashboard",
  "Landing page",
  "Automation",
];

const validateForm = (form) => {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.name.trim()) errors.name = "Add your name.";
  if (!form.email.trim()) {
    errors.email = "Add your email.";
  } else if (!emailPattern.test(form.email.trim())) {
    errors.email = "Use a valid email address.";
  }
  if (!form.subject.trim()) errors.subject = "Add a short subject.";
  if (!form.message.trim()) {
    errors.message = "Tell me what you need help with.";
  } else if (form.message.trim().length < 20) {
    errors.message = "Add a little more detail so I can reply usefully.";
  }

  return errors;
};

const Contact = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const { mutate, isPending, isSuccess, isError, error, reset } = useContactMutation();

  const mailtoHref = useMemo(() => `mailto:${contactEmail}?subject=Project%20inquiry`, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handlePromptClick = (prompt) => {
    setForm((prev) => ({
      ...prev,
      subject: prev.subject || prompt,
      message: prev.message || `I need help with a ${prompt.toLowerCase()}. `,
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.subject;
      delete next.message;
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validateForm(form);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    mutate({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    });
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setFieldErrors({});
    reset();
  };

  return (
    <main className="contact-page">
      <div className="contact-page__grain" aria-hidden="true" />

      <div className="contact-inner">
        <motion.section
          className="contact-hero"
          variants={container}
          initial="hidden"
          animate="visible"
          aria-labelledby="contact-title"
        >
          <motion.div className="contact-eyebrow" variants={item}>
            <span className="eyebrow-dot" aria-hidden="true" />
            Open for selected builds
          </motion.div>

          <motion.h1 id="contact-title" className="contact-heading" variants={item}>
            Tell me what you need built.
          </motion.h1>

          <motion.p className="contact-desc" variants={item}>
            Send the project context, budget range, and timeline. I will reply with
            the clearest next step within 24 hours.
          </motion.p>

          <motion.div className="contact-actions" variants={item} aria-label="Fast contact options">
            <a href={mailtoHref} className="contact-action contact-action--primary">
              <Envelope size={18} weight="duotone" />
              Email directly
            </a>
            <span className="contact-action contact-action--status">
              <Clock size={18} weight="duotone" />
              24 hour reply
            </span>
          </motion.div>

          <motion.div className="contact-signal" variants={item}>
            <PaperPlaneTilt size={18} weight="duotone" />
            <span>Best fit: launch pages, product interfaces, dashboards, and full-stack MVPs.</span>
          </motion.div>
        </motion.section>

        <motion.section
          className="contact-card"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 82, damping: 18, delay: 0.12 }}
          aria-label="Contact form"
        >
          {isSuccess ? (
            <div className="contact-success" role="status">
              <div className="success-icon-wrap">
                <CheckCircle size={34} weight="duotone" />
              </div>
              <h2>Message sent.</h2>
              <p>I have your note and will reply to the email you provided within 24 hours.</p>
              <button className="success-reset" onClick={handleReset}>
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-form__header">
                <span>Start here</span>
                <strong>Project inquiry</strong>
              </div>

              {isError && (
                <div className="contact-feedback contact-feedback--error" role="alert">
                  <WarningCircle size={18} weight="duotone" className="feedback-icon" />
                  <span>
                    <strong>Failed to send.</strong>{" "}
                    {error?.response?.data?.error || error?.message || "Please try again."}
                  </span>
                </div>
              )}

              <div className="contact-prompt-grid" aria-label="Common project types">
                {projectPrompts.map((prompt) => (
                  <button
                    className="contact-prompt"
                    key={prompt}
                    type="button"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    <Sparkle size={13} weight="duotone" />
                    {prompt}
                  </button>
                ))}
              </div>

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
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  />
                  {fieldErrors.name && <span id="name-error" className="field-error">{fieldErrors.name}</span>}
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
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  />
                  {fieldErrors.email && <span id="email-error" className="field-error">{fieldErrors.email}</span>}
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="subject">Project type</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Landing page, MVP, dashboard..."
                  value={form.subject}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(fieldErrors.subject)}
                  aria-describedby={fieldErrors.subject ? "subject-error" : undefined}
                />
                {fieldErrors.subject && <span id="subject-error" className="field-error">{fieldErrors.subject}</span>}
              </div>

              <div className="contact-field">
                <label htmlFor="message">What should happen next?</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Briefly describe the goal, current state, timeline, and any must-have features."
                  value={form.message}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={fieldErrors.message ? "message-error message-helper" : "message-helper"}
                />
                <span id="message-helper" className="field-helper">
                  A few details now means a more useful first reply.
                </span>
                {fieldErrors.message && <span id="message-error" className="field-error">{fieldErrors.message}</span>}
              </div>

              <button type="submit" className="contact-submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <span className="submit-skeleton" aria-hidden="true" />
                    Sending
                  </>
                ) : (
                  <>
                    Send project details
                    <ArrowRight size={17} weight="bold" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.section>

        <aside className="contact-proof" aria-label="More contact links">
          <div className="contact-proof__item">
            <span>Email</span>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </div>
          <div className="contact-proof__item">
            <span>Social</span>
            <div className="contact-socials">
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                <GithubLogo size={15} weight="fill" />
                GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedinLogo size={15} weight="fill" />
                LinkedIn
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter / X">
                <XLogo size={15} weight="fill" />
                X
              </a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Contact;
