// src/components/Faq.jsx
import { useState } from "react";
import "./faq.styles.scss";
import { faqData } from "./faqData";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq">
      <h1 className="heading">
        Frequently Asked <br /> Questions
      </h1>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
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
            {activeIndex === index && (
              <p className="faq-answer">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
