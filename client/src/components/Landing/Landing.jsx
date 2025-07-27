import "./landing.styles.scss";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { profileImage } from "../../constants/constants";

// Creative text animation
const textVariant = {
  hidden: { opacity: 0, y: 50, rotate: -5 },
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

// Creative image animation
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

const Landing = () => {
  return (
    <div id="landing">
      <div className="landing-wrapper">
        {/* Text Section */}
        <motion.div
          className="text-wrapper"
          variants={textVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h1 className="heading">
            LAND A NEW CAREER WITH NEXT-LEVEL MENTORSHIP
          </h1>
          <p>
            Start Your Tech Career in 6 Months. Master the MERN Stack, gain
            hands-on experience with AI tools, and accelerate your journey with
            expert mentorship to become fully job-ready in today’s high-demand
            tech industry.
          </p>
          <Link to="/mentorship" className="cta">
            Get Started!
          </Link>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="img-wrapper"
          variants={imageVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.05, rotate: -2 }}
        >
          <img src={profileImage} alt="Profile" />
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
