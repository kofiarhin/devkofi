import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./faq.styles.scss";
import { faqData } from "./faqData";

// Animation Variants
const containerVariant = {
  hidden: { opacity: 0, y: 40 },
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
    transition: { delay: index * 0.1, duration: 0.4, ease: "easeOut" },
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
    transition: { duration: 0.25, ease: "easeInOut" },
  },
};

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq">
      <motion.div
        className="faq-header"
        variants={containerVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="faq-heading">
          Frequently Asked <br /> Questions
        </h2>
        <p className="faq-subtitle">
          Everything you need to know about DevKofi’s bootcamps, pricing, and
          memberships.
        </p>
      </motion.div>

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
              className={`faq-question ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => toggleAnswer(index)}
            >
              <span>{item.question}</span>
              <span
                className={`faq-toggle ${activeIndex === index ? "open" : ""}`}
              >
                {activeIndex === index ? "−" : "+"}
              </span>
            </button>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  className="faq-answer"
                  variants={answerVariant}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <p>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
