import { useId, useState } from "react";
import { Minus, Plus } from "@phosphor-icons/react";
import { HOME_FAQ_ITEMS } from "./home-faq.constants";
import "./home-faq.styles.scss";

const HomeFAQ = () => {
  const baseId = useId();
  const [openItems, setOpenItems] = useState([0]);

  const toggleItem = (index) => {
    setOpenItems((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  };

  return (
    <section className="home-faq" aria-labelledby="home-faq-title">
      <div className="home-faq__layout">
        <div className="home-faq__intro">
          <p className="home-faq__eyebrow">FAQ</p>
          <h2 id="home-faq-title" className="home-faq__title">
            Questions before you build with AI.
          </h2>
          <p className="home-faq__description">
            Clear answers on the mentorship, workflow, support levels, and
            newsletter before you apply or book a call.
          </p>
          <p className="home-faq__proof">
            Built for developers who want practical shipping discipline, not AI
            shortcuts.
          </p>
        </div>

        <div className="home-faq__list">
          {HOME_FAQ_ITEMS.map((item, index) => {
            const isOpen = openItems.includes(index);
            const buttonId = `${baseId}-button-${index}`;
            const panelId = `${baseId}-panel-${index}`;
            const Icon = isOpen ? Minus : Plus;

            return (
              <div
                key={item.question}
                className={`home-faq__item ${isOpen ? "is-open" : ""}`.trim()}
              >
                <button
                  id={buttonId}
                  type="button"
                  className="home-faq__button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(index)}
                >
                  <span className="home-faq__question">{item.question}</span>
                  <span className="home-faq__icon" aria-hidden="true">
                    <Icon size={18} weight="bold" />
                  </span>
                </button>

                <div
                  id={panelId}
                  className="home-faq__panel"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                >
                  <p className="home-faq__answer">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
