import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { profileImage } from "../../constants/constants";
import "./landing.styles.scss";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Users,
  StackSimple,
  Lightning,
  Brain,
} from "@phosphor-icons/react";

const spring = { type: "spring", stiffness: 100, damping: 20 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...spring, duration: 0.6 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...spring, duration: 0.7, delay: 0.25 },
  },
};

const STATS = [
  { icon: StackSimple, value: "12+", label: "Apps shipped" },
  { icon: Star, value: "5+", label: "Years mentoring" },
  { icon: Users, value: "AI", label: "Engineering workflow" },
];

const HERO_ROTATING_PHRASES = [
  "AI Agents",
  "Claude Code",
  "Codex Workflows",
  "Spec to Deploy",
];

const LONGEST_HERO_PHRASE = HERO_ROTATING_PHRASES.reduce((longest, phrase) =>
  phrase.length > longest.length ? phrase : longest,
);

const HERO_DESCRIPTION_PHRASES = [
  "Learn AI engineering through production-focused mentorship.",
  "Turn prompts into specs, architecture, tests, and working systems.",
  "Build with Claude Code, Codex, and agents inside a real workflow.",
  "Ship MERN apps with validation, deployment, and code review built in.",
];

const LONGEST_HERO_DESCRIPTION = HERO_DESCRIPTION_PHRASES.reduce(
  (longest, phrase) => (phrase.length > longest.length ? phrase : longest),
);

const HeroRotatingText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % HERO_ROTATING_PHRASES.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <span className="hero-rotating-text">
      <span className="hero-rotating-text__measure">
        {LONGEST_HERO_PHRASE}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={HERO_ROTATING_PHRASES[currentIndex]}
          className="hero-rotating-text__item"
          initial={{ opacity: 0.42, y: "0.32em" }}
          animate={{ opacity: 1, y: "0em" }}
          exit={{ opacity: 0.42, y: "-0.32em" }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          {HERO_ROTATING_PHRASES[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const HeroAnimatedHeadline = () => (
  <>
    <span className="hero-title-line hero-title-line--primary">
      {"Build production software".split(" ").map((word, index) => (
        <motion.span
          className="hero-title-word"
          key={word}
          initial={{ opacity: 0, y: "0.42em" }}
          animate={{ opacity: 1, y: "0em" }}
          transition={{
            duration: 0.46,
            delay: 0.2 + index * 0.07,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
    <span className="hero-title-line hero-title-line--rotating">
      <span className="hero-title-prefix">with</span>
      <HeroRotatingText />
    </span>
  </>
);

const HeroRotatingDescription = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentIndex(
        (index) => (index + 1) % HERO_DESCRIPTION_PHRASES.length,
      );
    }, 3600);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <span className="hero-rotating-description">
      <span className="hero-rotating-description__measure">
        {LONGEST_HERO_DESCRIPTION}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={HERO_DESCRIPTION_PHRASES[currentIndex]}
          className="hero-rotating-description__item"
          initial={{ opacity: 0.34, y: "0.7em" }}
          animate={{ opacity: 1, y: "0em" }}
          exit={{ opacity: 0.34, y: "-0.7em" }}
          transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
        >
          {HERO_DESCRIPTION_PHRASES[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const Landing = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -14]);

  return (
    <section id="landing" ref={heroRef}>
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-gradient-orb hero-gradient-orb--1" aria-hidden="true" />
      <div className="hero-gradient-orb hero-gradient-orb--2" aria-hidden="true" />

      <div className="landing-grid">
        <motion.div
          className="landing-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-chip" variants={itemVariants}>
            <span className="chip-dot" aria-hidden="true" />
            <Lightning size={12} weight="fill" aria-hidden="true" />
            Agentic AI Coding Mentorship
          </motion.div>

          <motion.h1 className="hero-title" variants={itemVariants}>
            <HeroAnimatedHeadline />
          </motion.h1>

          <motion.p className="hero-description" variants={itemVariants}>
            <HeroRotatingDescription />
          </motion.p>

          <motion.div className="hero-proof" variants={itemVariants}>
            <span>Spec</span>
            <span>Architecture</span>
            <span>Agent Build</span>
            <span>Review</span>
            <span>Deploy</span>
          </motion.div>

          <motion.div className="cta-group" variants={itemVariants}>
            <Link to="/contact" className="btn-primary">
              Start Mentorship
              <ArrowRight size={18} weight="bold" />
            </Link>
            <Link to="/projects" className="btn-ghost">
              See Workflow
              <ArrowRight size={16} weight="bold" />
            </Link>
          </motion.div>

          <motion.p className="hero-supporting" variants={itemVariants}>
            A structured mentorship path for developers who want to engineer
            production software with AI tools, not just prompt for snippets.
          </motion.p>

          <motion.div className="hero-stats" variants={itemVariants}>
            {STATS.map(({ icon: Icon, value, label }) => (
              <div className="stat-item" key={label}>
                <Icon size={16} weight="duotone" aria-hidden="true" />
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="landing-visual"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          style={{ y: imageY }}
        >
          <div className="image-frame">
            <motion.img
              src={profileImage}
              alt="DevKofi - Senior MERN Engineer"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{
                opacity: 1,
                scale: [1, 1.03, 1],
                y: [0, -10, 0],
              }}
              transition={{
                opacity: { duration: 0.7, delay: 0.35 },
                scale: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.35,
                },
                y: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.35,
                },
              }}
            />
            <div className="frame-shine" aria-hidden="true" />
            <div className="frame-border-glow" aria-hidden="true" />
          </div>

          <motion.div
            className="experience-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            style={{ y: badgeY }}
          >
            5+<span>Years</span>
          </motion.div>

          <div className="floating-tag floating-tag--top" aria-hidden="true">
            <StackSimple size={14} weight="duotone" />
            MERN Stack
          </div>

          <div className="floating-tag floating-tag--bottom" aria-hidden="true">
            <Brain size={14} weight="duotone" />
            AI Workflow
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Landing;
