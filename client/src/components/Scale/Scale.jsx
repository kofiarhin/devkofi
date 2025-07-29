import "./scale.styles.scss";
import { codeSnippetImage } from "../../constants/constants";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

const Scale = () => {
  return (
    <div id="scale">
      <div className="scale-wrapper">
        {/* Text Section with Animation */}
        <motion.div
          className="text-wrapper"
          variants={textVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h1 className="heading">
            Code Meant to <br /> Scale...
          </h1>
          <p>
            A deliberate, disciplined mindset for building systems that
            last—design with foresight, architect with clarity, refactor with
            purpose, and ship solutions that grow without breaking.
          </p>
          <Link to="/mentorship" className="cta">
            Join Now
          </Link>
        </motion.div>

        {/* Image Section with Animation */}
        <motion.div
          className="image-wrapper"
          variants={imageVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.05, rotate: -2 }}
        >
          <img src={codeSnippetImage} alt="Code Snippet" />
        </motion.div>
      </div>
    </div>
  );
};

export default Scale;
