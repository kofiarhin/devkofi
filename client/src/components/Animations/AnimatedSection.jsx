// src/components/AnimatedSection.jsx
import { motion } from "framer-motion";

const AnimatedSection = ({
  variant,
  children,
  hoverEffect,
  className,
  once = true,
  amount = 0.3,
}) => {
  return (
    <motion.div
      className={className}
      variants={variant}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      whileHover={hoverEffect}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
