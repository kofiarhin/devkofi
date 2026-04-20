import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import "./highlights.styles.scss";

const spring = { type: "spring", stiffness: 100, damping: 20 };

const CARDS = [
  {
    id: "career",
    image: { src: "/assets/friends-showdown.png", alt: "Career growth visual" },
    title: "Career-Focused from day one",
    description:
      "Clean GitHub repos, meaningful commit history, deployed projects, and the confidence to explain technical decisions in interviews.",
    cta: { label: "Get Started", url: "/register" },
  },
  {
    id: "teams",
    image: { src: "/assets/crypto-pulse-pro.png", alt: "Team collaboration visual" },
    title: "Built for Teams that need to move fast",
    description:
      "Hands-on technical upskilling for teams. Direct access to a senior engineer, tailored sessions around your actual codebase.",
    cta: { label: "Request Team Access", url: "/enterprise" },
  },
];

const HighlightCard = ({ card, delay }) => (
  <motion.div
    className="highlight-card"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ ...spring, duration: 0.7, delay }}
  >
    <div className="card-image">
      <motion.img
        src={card.image.src}
        alt={card.image.alt}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
    <div className="card-body">
      <h3 className="card-title">{card.title}</h3>
      <p className="card-desc">{card.description}</p>
      <Link to={card.cta.url} className="card-cta">
        {card.cta.label}
        <ArrowRight size={16} weight="bold" />
      </Link>
    </div>
  </motion.div>
);

const Highlights = () => {
  return (
    <section className="highlights">
      <div className="highlights-inner">
        <motion.div
          className="highlights-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...spring, duration: 0.6 }}
        >
          <span className="highlights-eyebrow">Who it's for</span>
          <h2 className="highlights-title">
            Built for individuals
            <br />
            <span className="highlights-title--accent">and teams</span>
          </h2>
        </motion.div>

        <div className="highlights-grid">
          {CARDS.map((card, i) => (
            <HighlightCard key={card.id} card={card} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
