import { motion } from "framer-motion";
import "./feature-section.styles.scss";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChalkboardTeacher,
  Rocket,
  Lightning,
  TrendUp,
  UsersThree,
} from "@phosphor-icons/react";

const spring = { type: "spring", stiffness: 100, damping: 20 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const tileVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...spring, duration: 0.6 },
  },
};

const FEATURES = [
  {
    id: "mentorship",
    icon: ChalkboardTeacher,
    label: "Mentorship",
    title: "1-to-1 Mentorship that actually ships",
    description:
      "Work directly with a senior MERN engineer. Sessions focus on real blockers — architecture, backend logic, frontend state, or deployment.",
    url: "/register",
    cta: "Join Now",
    size: "wide",
    accent: true,
  },
  {
    id: "projects",
    icon: Rocket,
    label: "Real Projects",
    title: "Real Projects, not toy apps",
    description:
      "Build production-grade applications with authentication, APIs, database schemas, error handling, and clean architecture.",
    url: "/projects",
    cta: "View Projects",
    size: "standard",
  },
  {
    id: "ai",
    icon: Lightning,
    label: "AI Workflow",
    title: "AI-Powered Workflow done the right way",
    description:
      "Use AI as a productivity multiplier. Prompt effectively, review AI-generated code, and integrate AI tools into real MERN workflows.",
    url: "/register",
    cta: "See How",
    size: "standard",
  },
  {
    id: "career",
    icon: TrendUp,
    label: "Career Growth",
    title: "Career-Focused from day one",
    description:
      "Clean GitHub repos, meaningful commit history, deployed projects, and the confidence to explain technical decisions in interviews.",
    url: "/register",
    cta: "Get Started",
    size: "standard",
  },
  {
    id: "teams",
    icon: UsersThree,
    label: "Teams",
    title: "Built for Teams that need to move fast",
    description:
      "Hands-on technical upskilling for teams. Direct access to a senior engineer, tailored sessions around your actual codebase, and projects aligned with business goals.",
    url: "/enterprise",
    cta: "Request Team Access",
    size: "wide",
  },
];

const BentoTile = ({ feature }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      className={`bento-tile bento-tile--${feature.size} ${feature.accent ? "bento-tile--accent" : ""}`}
      variants={tileVariants}
    >
      <div className="tile-header">
        <div className="tile-icon">
          <Icon size={22} weight="duotone" />
        </div>
        <span className="tile-label">{feature.label}</span>
      </div>

      <h3 className="tile-title">{feature.title}</h3>
      <p className="tile-description">{feature.description}</p>

      <Link to={feature.url} className="tile-cta">
        {feature.cta}
        <ArrowRight size={15} weight="bold" />
      </Link>
    </motion.div>
  );
};

const FeatureBento = () => {
  return (
    <section className="feature-bento">
      <motion.div
        className="bento-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ ...spring, duration: 0.6 }}
      >
        <span className="bento-eyebrow">What you get</span>
        <h2 className="bento-title">
          Everything you need to
          <br />
          <span className="bento-title--accent">ship real products</span>
        </h2>
      </motion.div>

      <motion.div
        className="bento-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {FEATURES.map((feature) => (
          <BentoTile key={feature.id} feature={feature} />
        ))}
      </motion.div>
    </section>
  );
};

export default FeatureBento;
