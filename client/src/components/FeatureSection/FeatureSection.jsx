import { motion } from "framer-motion";
import "./feature-section.styles.scss";
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";

const spring = { type: "spring", stiffness: 100, damping: 20 };

const ZIG_ZAG_ROWS = [
  {
    number: "01",
    label: "Mentorship",
    title: "1-to-1 Mentorship that actually ships",
    description:
      "Work directly with a senior MERN engineer. Sessions focus on real blockers — architecture, backend logic, frontend state, or deployment. No generic advice. No fluff.",
    cta: { label: "Join Now", url: "/register" },
    image: { src: "/assets/feedhub.png", alt: "FeedHub — real-world MERN app" },
    layout: "image-left",
  },
  {
    number: "02",
    label: "Real Projects",
    title: "Real Projects, not toy apps",
    description:
      "Build production-grade applications with authentication, APIs, database schemas, error handling, and clean architecture that you can actually show employers.",
    cta: { label: "View Projects", url: "/projects" },
    image: { src: "/assets/crypto-pulse-pro.png", alt: "Crypto Pulse Pro dashboard" },
    layout: "image-right",
  },
  {
    number: "03",
    label: "AI Workflow",
    title: "AI-Powered Workflow done the right way",
    description:
      "Use AI as a productivity multiplier. Prompt effectively, review AI-generated code critically, and integrate AI tools into real MERN workflows without losing engineering fundamentals.",
    cta: { label: "See How", url: "/register" },
    image: { src: "/assets/kflix.png", alt: "KFlix — streaming UI project" },
    layout: "image-left",
  },
];

const FeatureRow = ({ row }) => (
  <motion.div
    className={`feature-row feature-row--${row.layout}`}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ ...spring, duration: 0.7 }}
  >
    <div className="feature-row__image">
      <motion.img
        src={row.image.src}
        alt={row.image.alt}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>

    <div className="feature-row__content">
      <span className="feature-number">{row.number}</span>
      <span className="feature-label">{row.label}</span>
      <h3 className="feature-title">{row.title}</h3>
      <p className="feature-desc">{row.description}</p>
      <Link to={row.cta.url} className="feature-cta">
        {row.cta.label}
        <ArrowRight size={16} weight="bold" />
      </Link>
    </div>
  </motion.div>
);

const FeatureBento = () => {
  return (
    <section className="features-zigzag">
      <motion.div
        className="features-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ ...spring, duration: 0.6 }}
      >
        <span className="features-eyebrow">What you get</span>
        <h2 className="features-title">
          Everything you need to
          <br />
          <span className="features-title--accent">ship real products</span>
        </h2>
      </motion.div>

      <div className="features-rows">
        {ZIG_ZAG_ROWS.map((row) => (
          <FeatureRow key={row.number} row={row} />
        ))}
      </div>
    </section>
  );
};

export default FeatureBento;
