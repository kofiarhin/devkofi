import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  { icon: StackSimple, value: "12+", label: "Production apps shipped" },
  { icon: Star, value: "5+", label: "Years experience" },
  { icon: Users, value: "MERN", label: "Full-stack expertise" },
];

const SCRAMBLE_WORDS = ["MERN", "Full-Stack", "Production", "Scalable"];

const TextScramble = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(SCRAMBLE_WORDS[0]);
  const [isScrambling, setIsScrambling] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  useEffect(() => {
    const interval = setInterval(() => {
      setIsScrambling(true);
      const nextIndex = (currentIndex + 1) % SCRAMBLE_WORDS.length;
      const target = SCRAMBLE_WORDS[nextIndex];
      let iteration = 0;
      const maxIterations = target.length;

      const scrambleInterval = setInterval(() => {
        setDisplayText(
          target
            .split("")
            .map((char, i) => {
              if (i < iteration) return char;
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join(""),
        );

        iteration += 1 / 2;

        if (iteration >= maxIterations) {
          clearInterval(scrambleInterval);
          setDisplayText(target);
          setCurrentIndex(nextIndex);
          setIsScrambling(false);
        }
      }, 40);

      return () => clearInterval(scrambleInterval);
    }, 3200);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <span className={`scramble-text ${isScrambling ? "is-active" : ""}`}>
      {displayText}
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
            Senior MERN Engineer
          </motion.div>

          <motion.h1 className="hero-title" variants={itemVariants}>
            <span className="hero-title-line">Building Real</span>
            <span className="hero-title-line">
              <TextScramble /> Products
            </span>
            <span className="hero-title-line hero-title-line--accent">
              the Right Way
            </span>
          </motion.h1>

          <motion.p className="hero-description" variants={itemVariants}>
            Full-stack engineer specialising in MERN. I build and ship production
            apps with clean architecture, AI-powered workflows, and attention to
            every detail.
          </motion.p>

          <motion.div className="cta-group" variants={itemVariants}>
            <Link to="/contact" className="btn-primary">
              Get in Touch
              <ArrowRight size={18} weight="bold" />
            </Link>
            <Link to="/projects" className="btn-ghost">
              View Projects
              <ArrowRight size={16} weight="bold" />
            </Link>
          </motion.div>

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
            <img src={profileImage} alt="DevKofi — Senior MERN Engineer" />
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
