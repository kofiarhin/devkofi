// src/animations/animationVariants.js
export const textVariant = {
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

export const imageVariant = {
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
