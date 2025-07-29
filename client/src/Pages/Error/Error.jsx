import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./error.styles.scss";

// Animation Variants
const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const iconVariant = {
  hidden: { rotate: -15, opacity: 0, scale: 0.5 },
  show: {
    rotate: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
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

const Error = () => {
  return (
    <section className="error">
      <motion.div
        className="card"
        variants={containerVariant}
        initial="hidden"
        animate="show"
      >
        {/* Icon */}
        <motion.div className="icon" variants={iconVariant}>
          <span>🚫</span>
        </motion.div>

        {/* Heading */}
        <motion.h1 variants={cardVariant}>Something Went Wrong</motion.h1>

        {/* Description */}
        <motion.p variants={textVariant}>
          Oops! There was a problem processing your request. Please try again
          later or contact support if the issue persists.
        </motion.p>

        {/* Back to Home Button */}
        <motion.div variants={buttonVariant} whileHover="hover" whileTap="tap">
          <Link to="/" className="primary-btn">
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Error;
