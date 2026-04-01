import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { profileImage } from "../../constants/constants";
import "./landing.styles.scss";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Users, Layers } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
};

const STATS = [
  { icon: Users, value: "47+", label: "Engineers mentored" },
  { icon: Star, value: "4.8", label: "Avg. mentor rating" },
  { icon: Layers, value: "12+", label: "Production apps shipped" },
];

const Landing = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -22]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -10]);

  return (
    <section id="landing" ref={heroRef}>
      <motion.div
        className="hero-glow"
        style={{ y: glowY }}
        aria-hidden="true"
      />

      <motion.div
        className="landing-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-chip" variants={itemVariants}>
          <span className="chip-dot" aria-hidden="true" />
          AI-Powered MERN Stack Mentorship
        </motion.div>

        <h1 className="hero-title">
          <motion.span className="hero-title-line" variants={itemVariants}>
            Build Real MERN Products
          </motion.span>
          <motion.span
            className="hero-title-line accent"
            variants={itemVariants}
          >
            with AI the Right Way
          </motion.span>
        </h1>

        <motion.p className="hero-description" variants={itemVariants}>
          Learn engineering-first workflows for planning, feature scoping, code
          generation, debugging, refactoring, testing, and shipping. Mentorship
          for real products, not toy apps.
        </motion.p>

        <motion.div className="cta-group" variants={itemVariants}>
          <Link to="/register" className="btn-primary">
            Apply for Mentorship
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
          <Link to="/projects" className="btn-ghost">
            View Projects
          </Link>
        </motion.div>

        <motion.div className="hero-stats" variants={itemVariants}>
          {STATS.map(({ icon: Icon, value, label }) => (
            <div className="stat-item" key={label}>
              <Icon size={15} strokeWidth={2} aria-hidden="true" />
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="landing-image"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        style={{ y: imageY }}
      >
        <div className="image-wrapper">
          <img src={profileImage} alt="DevKofi — Senior MERN Engineer" />
          <motion.div
            className="experience-badge"
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.62,
            }}
            style={{ y: badgeY }}
          >
            5+<span>Years</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Landing;
