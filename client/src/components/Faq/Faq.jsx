// src/components/Faq.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./faq.styles.scss";
import { faqData } from "./faqData";

// Variants for FAQ container and items
const containerVariant = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.15, duration: 0.4 },
  }),
};

const answerVariant = {
  hidden: { opacity: 0, height: 0 },
  show: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq">
      {/* Animated Heading */}
      <motion.h1
        className="heading"
        variants={containerVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        Frequently Asked <br /> Questions
      </motion.h1>

      <div className="faq-list">
        {faqData.map((item, index) => (
          <motion.div
            key={index}
            className="faq-item"
            variants={itemVariant}
            custom={index}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <button
              className="faq-question"
              onClick={() => toggleAnswer(index)}
            >
              {item.question}
              <span
                className={`faq-toggle ${activeIndex === index ? "open" : ""}`}
              >
                {activeIndex === index ? "−" : "+"}
              </span>
            </button>

            {/* Animated Answer */}
            <AnimatePresence>
              {activeIndex === index && (
                <motion.p
                  className="faq-answer"
                  variants={answerVariant}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {item.answer}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
