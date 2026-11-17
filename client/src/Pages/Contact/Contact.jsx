import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  ChatCenteredText,
  Clock,
  Envelope,
  GithubLogo,
  LinkedinLogo,
  PaperPlaneTilt,
  Sparkle,
  WarningCircle,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import useContactMutation from "../../hooks/useContactMutation";
import { BOOK_CALL_LABEL, BOOK_CALL_PATH } from "../../constants/booking";
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

const enquiryPrompts = [
  {
    label: "AI integration",
    message: "We want to add AI to an existing system. What we run today: . What we want AI to help with: . Desired outcome: . Timeline: .",
  },
  {
    label: "AI prototype to production",
    message: "We have an AI prototype that needs to become dependable software. What it does today: . What is unreliable: . Systems involved: . Timeline: .",
  },
  {
    label: "AI engineering mentorship",
    message: "I'd like 1-on-1 AI engineering mentorship. My current level: . What I want to build or learn: . Availability: .",
  },
  {
    label: "MERN stack mentorship",
    message: "I'd like 1-on-1 MERN stack mentorship. My current level: . What I want to build: . Availability: .",
  },
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
    errors.message = "Tell me what you need and the outcome you want.";
  } else if (form.message.trim().length < 20) {
    errors.message = "Add a little more detail so the first reply can be useful.";
  }

  return errors;
};

const Contact = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const { mutate, isPending, isSuccess, isError, error, reset } = useContactMutation();

  const mailtoHref = useMemo(
    () => `mailto:${contactEmail}?subject=DevKofi%20enquiry`,
    [],
  );
  const isFormEmpty = Object.values(form).every((value) => !value.trim());

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
      subject: prev.subject || prompt.label,
      message: prev.message || prompt.message,
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
            AI integration and 1-on-1 mentorship
          </motion.div>

          <motion.h1 id="contact-title" className="contact-heading" variants={item}>
            Tell me what you're working on.
          </motion.h1>

          <motion.p className="contact-desc" variants={item}>
            Prefer writing to a call? Share the system you run or what you want to learn, and the outcome you need.
            I will reply with the clearest next step within 24 hours.
          </motion.p>

          <motion.div className="contact-actions" variants={item} aria-label="Fast contact options">
            <Link to={BOOK_CALL_PATH} className="contact-action contact-action--primary">
              <Clock size={18} weight="duotone" />
              {BOOK_CALL_LABEL}
            </Link>
            <a href={mailtoHref} className="contact-action contact-action--status">
              <Envelope size={18} weight="duotone" />
              Email directly
            </a>
          </motion.div>

          <motion.div className="contact-signal" variants={item}>
            <PaperPlaneTilt size={18} weight="duotone" />
            <span>
              Businesses adding AI to existing systems, and developers who want 1-on-1 AI engineering or MERN stack mentorship.
            </span>
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
                <strong>Send a message</strong>
              </div>

              {isFormEmpty && (
                <div className="contact-empty-state" aria-live="polite">
                  <span className="contact-empty-state__icon" aria-hidden="true">
                    <ChatCenteredText size={20} weight="duotone" />
                  </span>
                  <p>Start with what you want to build, integrate or learn.</p>
                </div>
              )}

              {isError && (
                <div className="contact-feedback contact-feedback--error" role="alert">
                  <WarningCircle size={18} weight="duotone" className="feedback-icon" />
                  <span>
                    <strong>Failed to send.</strong>{" "}
                    {error?.response?.data?.error || error?.message || "Please try again."}
                  </span>
                </div>
              )}

              <div className="contact-prompt-grid" aria-label="Common enquiry types">
                {enquiryPrompts.map((prompt) => (
                  <button
                    className="contact-prompt"
                    key={prompt.label}
                    type="button"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    <Sparkle size={13} weight="duotone" />
                    {prompt.label}
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
                    placeholder="you@company.com"
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
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="AI integration, AI mentorship, MERN mentorship..."
                  value={form.subject}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(fieldErrors.subject)}
                  aria-describedby={fieldErrors.subject ? "subject-error" : undefined}
                />
                {fieldErrors.subject && <span id="subject-error" className="field-error">{fieldErrors.subject}</span>}
              </div>

              <div className="contact-field">
                <label htmlFor="message">What you need and the outcome you want</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="For a business: what you run today and what you want AI to help with. For mentorship: your current level and what you want to build."
                  value={form.message}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={fieldErrors.message ? "message-error message-helper" : "message-helper"}
                />
                <span id="message-helper" className="field-helper">
                  A little context on your goal and timeline makes the first reply sharper.
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
                    Send message
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
              <a href="https://github.com/kofiarhin" target="_blank" rel="noreferrer" aria-label="GitHub">
                <GithubLogo size={15} weight="fill" />
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/kofi-arhin" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedinLogo size={15} weight="fill" />
                LinkedIn
              </a>
              <a href="https://x.com/kwofiArhin" target="_blank" rel="noreferrer" aria-label="X">
                <XLogo size={15} weight="fill" />
                X
              </a>
              <a href="https://www.youtube.com/@devkofi" target="_blank" rel="noreferrer" aria-label="YouTube">
                <YoutubeLogo size={15} weight="fill" />
                YouTube
              </a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Contact;
