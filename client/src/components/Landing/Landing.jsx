import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { profileImage } from "../../constants/constants";
import "./landing.styles.scss";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
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
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.18 },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.5 },
  },
};

const Landing = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 16]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -10]);

  return (
    <section id="landing" ref={heroRef}>
      <motion.div className="hero-glow" style={{ y: glowY }} aria-hidden="true" />

      <motion.div
        className="landing-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 className="hero-subtitle" variants={itemVariants}>
          DevKofi AI-Powered MERN Stack Mentorship
        </motion.h2>

        <h1 className="hero-title">
          <motion.span className="hero-title-line" variants={itemVariants} initial="hidden" animate="visible">
            Build Real MERN Products
          </motion.span>
          <motion.span
            className="accent"
            variants={{
              hidden: { opacity: 0, y: 22 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            with AI the Right Way
          </motion.span>
        </h1>

        <motion.div className="glass-card" variants={itemVariants}>
          <p className="hero-description">
            Learn engineering-first workflows for planning, feature scoping,
            code generation, debugging, refactoring, testing, documentation, and
            shipping. This is mentorship for real products, not toy apps.
          </p>

          <motion.div
            className="cta-group"
            variants={{
              hidden: { opacity: 0, y: 10, scale: 0.98 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <Link to="/register" className="btn-primary">
              Apply for Mentorship
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div className="landing-image" variants={imageVariants} initial="hidden" animate="visible" style={{ y: imageY }}>
        <div className="image-wrapper">
          <img src={profileImage} alt="DevKofi Mentor" />
          <motion.div className="experience-badge" variants={badgeVariants} initial="hidden" animate="visible" style={{ y: badgeY }}>
            5+
            <span>Years</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Landing;
