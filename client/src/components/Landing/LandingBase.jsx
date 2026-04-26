import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
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
  { icon: Star, value: "5+", label: "Years guiding builds" },
  { icon: Users, value: "AI", label: "Workflow-first training" },
];

const HERO_ROTATING_PHRASES = [
  "AI agents",
  "Claude Code",
  "Codex workflows",
  "spec-to-deploy",
];

const LONGEST_HERO_PHRASE = HERO_ROTATING_PHRASES.reduce((longest, phrase) =>
  phrase.length > longest.length ? phrase : longest,
);

const HERO_DESCRIPTION_PHRASES = [
  "Learn AI engineering through production-focused mentorship.",
  "Turn rough ideas into specs, architecture, tests, and working systems.",
  "Use Claude Code, Codex, and agents inside a disciplined build workflow.",
  "Ship MERN apps with validation, review, and deployment built in.",
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
  const frameRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 32]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -18]);

  // 3-D tilt tracking
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tiltX = useSpring(useTransform(rawY, [-1, 1], [12, -12]), { stiffness: 180, damping: 28 });
  const tiltY = useSpring(useTransform(rawX, [-1, 1], [-12, 12]), { stiffness: 180, damping: 28 });

  const handleMouseMove = (e) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width * 2 - 1);
    rawY.set((e.clientY - rect.top) / rect.height * 2 - 1);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

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
            AI Engineering Mentorship
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
            <span>AI Build</span>
            <span>Review</span>
            <span>Deploy</span>
          </motion.div>

          <motion.div className="cta-group" variants={itemVariants}>
            <Link to="/contact" className="btn-primary">
              Start mentorship
              <ArrowRight size={18} weight="bold" />
            </Link>
            <Link to="/projects" className="btn-ghost">
              See the work
              <ArrowRight size={16} weight="bold" />
            </Link>
          </motion.div>

          <motion.p className="hero-supporting" variants={itemVariants}>
            A structured path for developers who want to build production
            software with AI tools while keeping engineering judgment in the loop.
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
          {/* 3-D tilt wrapper */}
          <motion.div
            ref={frameRef}
            className="image-frame-wrapper"
            style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 700 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="image-frame">
              <motion.img
                src={profileImage}
                alt="DevKofi - Senior MERN Engineer"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.04, 1],
                  y: [0, -18, 0],
                }}
                transition={{
                  opacity: { duration: 0.7, delay: 0.35 },
                  scale: {
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.35,
                  },
                  y: {
                    duration: 9,
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
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.75 }}
              style={{ y: badgeY }}
            >
              <motion.div
                className="experience-badge__ring"
                animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                aria-hidden="true"
              />
              5+<span>Years</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="floating-tag floating-tag--top"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0, y: [0, -9, 0] }}
            transition={{
              opacity: { delay: 0.9, duration: 0.5 },
              x: { delay: 0.9, duration: 0.5 },
              y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
            }}
            aria-hidden="true"
          >
            <StackSimple size={14} weight="duotone" />
            MERN Stack
          </motion.div>

          <motion.div
            className="floating-tag floating-tag--bottom"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0, y: [0, 9, 0] }}
            transition={{
              opacity: { delay: 1.05, duration: 0.5 },
              x: { delay: 1.05, duration: 0.5 },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
            }}
            aria-hidden="true"
          >
            <Brain size={14} weight="duotone" />
            AI Workflow
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Landing;
