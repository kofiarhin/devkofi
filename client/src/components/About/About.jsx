import "./about.styles.scss";
import { motion } from "framer-motion";
import { deskSetupImage } from "../../constants/constants";
import { Link } from "react-router-dom";

const textVariant = {
  hidden: { opacity: 0, x: -50 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 80, damping: 12, duration: 0.8 },
  },
};

const videoVariant = {
  hidden: { opacity: 0, x: 50, scale: 0.9 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 70, damping: 10, delay: 0.3 },
  },
};

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-wrapper">
        {/* Text Section */}
        <motion.div
          className="text-wrapper"
          variants={textVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h1 className="heading">Write, Test, Deploy...</h1>
          <p>
            A proven rhythm for building and shipping fast. Write with intent.
            Test with rigor. Deploy with confidence.
          </p>
          <Link to="/course-outline" className="cta primary-cta">
            Browse Course OUtline
          </Link>
        </motion.div>

        {/* Video Section */}
        <motion.div
          className="image-wrapper"
          variants={videoVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="video-container">
            {/* <iframe
              src="https://www.youtube.com/embed/b5wDQTlpeFI?modestbranding=1&rel=0&playsinline=1"
              title="Learn Test-Driven Development (TDD)"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe> */}
            <img src={deskSetupImage} alt="" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
