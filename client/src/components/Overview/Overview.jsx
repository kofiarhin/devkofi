import "./overview.styles.scss";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Typewriter from "../TypeWriter/TypeWrite";
import { text } from "./overviewData";

// Text animation variant
const textVariant = {
  hidden: { opacity: 0, y: 50, rotate: -3 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
      duration: 0.8,
    },
  },
};

// Image animation variant
const imageVariant = {
  hidden: { opacity: 0, scale: 0.8, rotate: 5 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 10,
      delay: 0.3,
    },
  },
};

const Overview = () => {
  return (
    <div id="overview">
      <div className="overview-wrapper">
        {/* Image Section with Animation */}
        <motion.div
          className="image-wrapper"
          variants={imageVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.05, rotate: -2 }}
        >
          <img
            src="https://res.cloudinary.com/dlsiabgiw/image/upload/v1753669719/devkofi/tri8gqr0qksux018d1bj.png"
            alt="Overview"
          />
        </motion.div>

        {/* Text Section with Animation */}
        <motion.div
          className="text-wrapper"
          variants={textVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h1 className="heading">
            Your Mentorship....<span>Your way.... </span>
          </h1>
          <Typewriter text={text} />
          <Link to="/register" className="cta">
            Join Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;
