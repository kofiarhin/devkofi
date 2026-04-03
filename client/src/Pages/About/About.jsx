import { useEffect, useRef, useState } from "react";
import "./about.styles.scss";
import { profileImage } from "../../constants/constants";

const trustStats = [
  { label: "Mentees Supported", value: "50+" },
  { label: "Projects Shipped", value: "30+" },
  { label: "Years Building", value: "7+" },
];

const credibilityCards = [
  {
    title: "Full-Stack Product Experience",
    body: "From feature scoping to production deployment, I coach with real product constraints in mind.",
  },
  {
    title: "MERN + AI Workflows",
    body: "Build modern MERN apps and use AI as a force multiplier for speed, quality, and debugging.",
  },
  {
    title: "Hands-On Mentorship",
    body: "We work through code reviews, architecture decisions, test strategy, and production readiness.",
  },
  {
    title: "Outcome-Focused Delivery",
    body: "The goal is simple: ship software that works in production and grows your engineering confidence.",
  },
];

const processSteps = [
  "Scope clear product goals and delivery milestones",
  "Build with guided implementation and review loops",
  "Refactor, test, and document meaningful decisions",
  "Deploy, monitor, and iterate based on feedback",
];

const outcomes = [
  "From tutorial dependency to independent product builder",
  "From local demos to deployment-ready software",
  "From shallow AI use to disciplined AI engineering workflows",
];

const AboutMe = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const revealClass = isVisible ? "is-revealed" : "";

  return (
    <section className={`about-page ${revealClass}`} ref={sectionRef} aria-label="About Kofi">
      <div className="about-page__container">
        <nav className="about-page__jump-links" aria-label="About section quick links">
          <a href="#about-philosophy">Philosophy</a>
          <a href="#about-process">How We Work</a>
          <a href="#about-outcomes">Outcomes</a>
          <a href="#about-cta">Apply</a>
        </nav>

        <header className="about-page__hero">
          <div className="about-page__visual">
            <div className="about-page__image-glow" aria-hidden="true"></div>
            <img
              className="about-page__profile-img"
              src={profileImage}
              alt="Kofi, mentor and full-stack engineer"
              loading="lazy"
            />
          </div>

          <div className="about-page__hero-content">
            <p className="about-page__eyebrow">About DevKofi</p>
            <h2 className="about-page__title">I Help Developers Build and Ship Real Products</h2>
            <p className="about-page__lead">
              I’m <strong>Kofi</strong> — a full-stack engineer and mentorship founder helping developers become
              engineering-first builders with practical AI workflows.
            </p>

            <div className="about-page__cta-group">
              <a className="about-page__btn about-page__btn--primary" href="/contact">
                Book a Mentorship Call
              </a>
              <a className="about-page__btn about-page__btn--secondary" href="/program">
                View Program
              </a>
            </div>

            <ul className="about-page__trust-row" aria-label="Trust metrics">
              {trustStats.map((item) => (
                <li key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <section className="about-page__section" aria-label="Credibility highlights">
          <div className="about-page__cards-grid">
            {credibilityCards.map((card) => (
              <article className="about-page__card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-page__section" id="about-philosophy">
          <h3 className="about-page__section-title">My Mentorship Philosophy</h3>
          <p>
            I teach with an <span className="about-page__highlight">engineering-first, AI-enhanced</span> mindset:
            use AI to accelerate delivery while keeping architecture quality, debugging discipline, and technical
            judgment at the center.
          </p>
        </section>

        <section className="about-page__section" id="about-process">
          <h3 className="about-page__section-title">How We Work</h3>
          <ol className="about-page__timeline">
            {processSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="about-page__section" id="about-outcomes">
          <h3 className="about-page__section-title">Transformation You Can Expect</h3>
          <ul className="about-page__outcomes">
            {outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </section>

        <section className="about-page__section about-page__story" aria-label="Personal story">
          <h3 className="about-page__section-title">Why I Mentor</h3>
          <p>
            I built DevKofi to help developers move beyond tutorials and start shipping real products with confidence.
          </p>
          <p>
            We focus on practical decision-making: scoping, clean architecture, code reviews, testing strategy, and
            production deployment.
          </p>
          <p>
            If your goal is to become the builder who can take ideas from zero to shipped software, I can help you get
            there.
          </p>
        </section>

        <section className="about-page__final-cta" id="about-cta" aria-label="Apply for mentorship">
          <h3>Ready to Build Your Next Product the Right Way?</h3>
          <p>Let’s turn your ideas into production-ready software with strong engineering habits.</p>
          <div className="about-page__cta-group">
            <a className="about-page__btn about-page__btn--primary" href="/contact">
              Apply for Mentorship
            </a>
            <a className="about-page__btn about-page__btn--secondary" href="/testimonials">
              See Success Stories
            </a>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AboutMe;
