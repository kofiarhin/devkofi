import "./about.styles.scss";
import { motion } from "framer-motion";

const textVariant = {
  hidden: { opacity: 0, x: -50 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
      duration: 0.8,
    },
  },
};

const videoVariant = {
  hidden: { opacity: 0, x: 50, scale: 0.9 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 10,
      delay: 0.3,
    },
  },
};

export default function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-wrapper">
        {/* Text Section Animation */}
        <motion.div
          className="text-wrapper"
          variants={textVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h1 className="heading">Write, Test, Deploy...</h1>
          <p>
            A flexible, focused rhythm for building and shipping—write with
            intent, test with rigor, fix with focus, deploy with confidence.
          </p>
        </motion.div>

        {/* Video Section Animation */}
        <motion.div
          className="video-wrapper"
          variants={videoVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              marginTop: "1rem",
            }}
          >
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              src="https://www.youtube.com/embed/b5wDQTlpeFI?si=LWc-h1Xm7Vn6k_fg"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
