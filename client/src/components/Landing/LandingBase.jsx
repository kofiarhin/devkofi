import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion as Motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  CaretRight,
  CheckCircle,
  Lightning,
  RocketLaunch,
  StackSimple,
  Star,
  Users,
} from "@phosphor-icons/react";
import { profileImage } from "../../constants/constants";
import "./landing.styles.scss";

const spring = { type: "spring", stiffness: 100, damping: 20 };

const PROCESS_STEPS = ["Spec", "Architecture", "AI Build", "Review", "Deploy"];

const HEADLINE_ROTATIONS = [
  "AI engineering.",
  "agent workflows.",
  "AI review loops.",
  "AI build agents.",
];

const STATS = [
  { icon: <StackSimple size={17} weight="duotone" aria-hidden="true" />, value: "12+", label: "Apps shipped" },
  { icon: <Star size={17} weight="duotone" aria-hidden="true" />, value: "5+", label: "Years mentoring" },
  { icon: <Users size={17} weight="duotone" aria-hidden="true" />, value: "AI", label: "Spec-to-deploy workflow" },
];

const WORKFLOW_ITEMS = [
  { icon: <Brain size={15} weight="duotone" />, label: "Review queue", value: "3 builds" },
  { icon: <CheckCircle size={15} weight="duotone" />, label: "Tests passing", value: "Green" },
  { icon: <RocketLaunch size={15} weight="duotone" />, label: "Deploy ready", value: "Heroku" },
];

const RotatingHeadlineText = ({ shouldReduceMotion }) => {
  const [index, setIndex] = useState(0);
  const longest = HEADLINE_ROTATIONS.reduce((current, phrase) =>
    phrase.length > current.length ? phrase : current,
  );

  useEffect(() => {
    if (shouldReduceMotion) return undefined;

    const interval = window.setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % HEADLINE_ROTATIONS.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <span>{HEADLINE_ROTATIONS[0]}</span>;
  }

  return (
    <span className="hero-rotating-headline">
      <span className="hero-rotating-headline__measure" aria-hidden="true">
        {longest}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <Motion.span
          key={HEADLINE_ROTATIONS[index]}
          className="hero-rotating-headline__item"
          initial={{ opacity: 0, y: "0.36em" }}
          animate={{ opacity: 1, y: "0em" }}
          exit={{ opacity: 0, y: "-0.36em" }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          {HEADLINE_ROTATIONS[index]}
        </Motion.span>
      </AnimatePresence>
    </span>
  );
};

const Landing = () => {
  const heroRef = useRef(null);
  const frameRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tiltX = useSpring(useTransform(rawY, [-1, 1], [9, -9]), {
    stiffness: 180,
    damping: 28,
  });
  const tiltY = useSpring(useTransform(rawX, [-1, 1], [-9, 9]), {
    stiffness: 180,
    damping: 28,
  });

  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.08, delayChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion ? { duration: 0 } : { ...spring, duration: 0.5 },
    },
  };

  const imageVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: shouldReduceMotion ? { duration: 0 } : { ...spring, duration: 0.65, delay: 0.18 },
    },
  };

  const handleMouseMove = (e) => {
    if (shouldReduceMotion) return;

    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;

    rawX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    rawY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const imageAnimate = shouldReduceMotion
    ? { opacity: 1, scale: 1, y: 0 }
    : {
        opacity: 1,
        scale: [1, 1.025, 1],
        y: [0, -10, 0],
      };

  const imageTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        opacity: { duration: 0.65, delay: 0.25 },
        scale: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.25 },
        y: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.25 },
      };

  const overlayAnimate = shouldReduceMotion
    ? { opacity: 1, x: 0, y: 0 }
    : { opacity: 1, x: 0, y: [0, -6, 0] };

  const overlayTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        opacity: { delay: 0.65, duration: 0.4 },
        x: { delay: 0.65, duration: 0.4 },
        y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
      };

  return (
    <section id="landing" ref={heroRef}>
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-gradient-orb hero-gradient-orb--1" aria-hidden="true" />

      <div className="landing-grid">
        <Motion.div
          className="landing-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Motion.div className="hero-chip" variants={itemVariants}>
            <span className="chip-dot" aria-hidden="true" />
            <Lightning size={12} weight="fill" aria-hidden="true" />
            AI Engineering Mentorship
          </Motion.div>

          <Motion.h1 className="hero-title" variants={itemVariants}>
            <span className="hero-title-line">Build production software</span>
            <span className="hero-title-line hero-title-line--accent">
              with <RotatingHeadlineText shouldReduceMotion={shouldReduceMotion} />
            </span>
          </Motion.h1>

          <Motion.p className="hero-description" variants={itemVariants}>
            Mentorship for developers building MERN apps with AI tools, tests,
            review loops, and deployment discipline.
          </Motion.p>

          <Motion.div
            className="hero-process"
            variants={itemVariants}
            aria-label="Mentorship workflow"
          >
            {PROCESS_STEPS.map((step, index) => (
              <span className="hero-process__item" key={step}>
                <span>{step}</span>
                {index < PROCESS_STEPS.length - 1 && (
                  <CaretRight size={14} weight="bold" aria-hidden="true" />
                )}
              </span>
            ))}
          </Motion.div>

          <Motion.div className="cta-group" variants={itemVariants}>
            <Link to="/contact" className="btn-primary">
              Start mentorship
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </Link>
            <Link to="/projects" className="btn-ghost">
              See the work
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </Link>
          </Motion.div>

          <Motion.div className="hero-stats" variants={itemVariants}>
            {STATS.map(({ icon, value, label }) => (
              <div className="stat-item" key={label}>
                {icon}
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </Motion.div>
        </Motion.div>

        <Motion.div
          className="landing-visual"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          style={{ y: shouldReduceMotion ? 0 : imageY }}
        >
          <Motion.div
            ref={frameRef}
            className="image-frame-wrapper"
            style={{
              rotateX: shouldReduceMotion ? 0 : tiltX,
              rotateY: shouldReduceMotion ? 0 : tiltY,
              transformPerspective: 700,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="image-frame">
              <Motion.img
                src={profileImage}
                alt="DevKofi portrait"
                initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 1.04 }}
                animate={imageAnimate}
                transition={imageTransition}
              />
              <div className="frame-shine" aria-hidden="true" />
              <div className="frame-border-glow" aria-hidden="true" />
            </div>

            <Motion.div
              className="experience-badge"
              initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.78 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { ...spring, delay: 0.5 }}
              aria-hidden="true"
            >
              <span className="experience-badge__value">5+</span>
              <span>Years</span>
            </Motion.div>
          </Motion.div>

          <Motion.div
            className="workflow-panel"
            initial={{ opacity: shouldReduceMotion ? 1 : 0, x: shouldReduceMotion ? 0 : -12 }}
            animate={overlayAnimate}
            transition={overlayTransition}
            aria-hidden="true"
          >
            <div className="workflow-panel__header">
              <span className="workflow-panel__dot" />
              Build review
            </div>

            <div className="workflow-panel__list">
              {WORKFLOW_ITEMS.map(({ icon, label, value }) => (
                <div className="workflow-panel__item" key={label}>
                  {icon}
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
};

export default Landing;
