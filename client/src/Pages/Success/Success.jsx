import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./success.styles.scss";
import { successData } from "./successData";

const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const headingVariant = {
  hidden: { opacity: 0, y: -30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const textVariant = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const buttonVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// ✅ Updated to motion.create()
const MotionLink = motion.create(Link);

const Success = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  const { heading, slug } = successData[type] || {
    heading: "Thank You for Contacting Me",
    slug: "Your message has been received successfully. I’ll get back to you as soon as possible.",
  };

  return (
    <section className="success">
      <motion.div
        className="overlay"
        variants={containerVariant}
        initial="hidden"
        animate="show"
      >
        <motion.div className="content" variants={containerVariant}>
          <motion.h1 variants={headingVariant}>{heading}</motion.h1>
          <motion.p variants={textVariant}>{slug}</motion.p>

          <MotionLink
            to="/"
            className="primary-btn"
            variants={buttonVariant}
            initial="hidden"
            animate="show"
            whileHover="hover"
            whileTap="tap"
          >
            Back to Home
          </MotionLink>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Success;
