import "./features.styles.scss";
import {
  FaHammer,
  FaShippingFast,
  FaBullseye,
  FaChartLine,
} from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { featuresData } from "./featuresData";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const Features = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  return (
    <div id="features" ref={ref}>
      <h1 className="heading">Why this works?</h1>
      <div className="features-wrapper">
        {featuresData.map(({ Icon, title, desc }, i) => (
          <motion.div
            className="features-unit"
            key={i}
            custom={i}
            initial="hidden"
            animate={controls}
            variants={fadeInUp}
          >
            <div className="icon-wrapper">
              <Icon className="icon" />
            </div>
            <div className="text-wrapper">
              <h2>{title}</h2>
              <p>{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Features;
