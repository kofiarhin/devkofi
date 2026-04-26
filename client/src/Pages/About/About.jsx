import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./about.styles.scss";
import { profileImage } from "../../constants/constants";

const trustStats = [
  { label: "Apps Shipped", value: "12+" },
  { label: "Years Mentoring", value: "5+" },
  { label: "Workflow Focus", value: "AI" },
];

const credibilityCards = [
  {
    title: "Production AI Engineering",
    body: "Learn how to turn prompts into specs, architecture, tests, and working software without losing technical judgment.",
  },
  {
    title: "Claude Code and Codex Workflows",
    body: "Use modern coding agents inside a disciplined build loop for planning, implementation, debugging, and review.",
  },
  {
    title: "MERN Systems That Ship",
    body: "Build React, Node, Express, and MongoDB projects with validation, API structure, deployment, and maintainability in mind.",
  },
  {
    title: "Code Review as a Habit",
    body: "Develop the review instincts to question generated code, reduce rework, and make stronger engineering decisions.",
  },
];

const processSteps = [
  "Define the product goal, constraints, and acceptance criteria",
  "Convert the idea into a practical spec and implementation plan",
  "Build with Claude Code, Codex, and agent-assisted review loops",
  "Test, deploy, and tighten the system based on real feedback",
];

const outcomes = [
  "From prompt experiments to repeatable AI engineering workflows",
  "From generated snippets to architecture you can explain and maintain",
  "From local demos to production-ready MERN applications",
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
              alt="Kofi, AI engineering mentor and full-stack engineer"
              loading="lazy"
            />
          </div>

          <div className="about-page__hero-content">
            <p className="about-page__eyebrow">About DevKofi</p>
            <h2 className="about-page__title">Mentorship for Developers Building With AI Agents</h2>
            <p className="about-page__lead">
              I am <strong>Kofi</strong>, a senior MERN engineer helping developers use Claude Code,
              Codex, and agentic workflows to plan, build, review, and ship production software.
            </p>

            <div className="about-page__cta-group">
              <Link className="about-page__btn about-page__btn--primary" to="/contact">
                Start Mentorship
              </Link>
              <Link className="about-page__btn about-page__btn--secondary" to="/projects">
                See Workflow
              </Link>
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
            I teach an <span className="about-page__highlight">engineering-first, AI-assisted</span> approach:
            use AI to move faster, but keep specs, architecture, debugging discipline, tests, and
            production judgment at the center of every decision.
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
          <h3 className="about-page__section-title">What You Learn to Do</h3>
          <ul className="about-page__outcomes">
            {outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </section>

        <section className="about-page__section about-page__story" aria-label="Personal story">
          <h3 className="about-page__section-title">Why I Mentor</h3>
          <p>
            I built DevKofi for developers who want more than AI-generated snippets. The goal is to
            become the engineer who can guide the tool, evaluate the output, and own the system.
          </p>
          <p>
            We work through the full delivery path: scoping, technical planning, agent-assisted builds,
            code review, test strategy, deployment, and iteration.
          </p>
          <p>
            If your goal is to build production MERN apps with AI as part of your engineering workflow,
            this mentorship is designed for that.
          </p>
        </section>

        <section className="about-page__final-cta" id="about-cta" aria-label="Apply for mentorship">
          <h3>Ready to Build With AI Like an Engineer?</h3>
          <p>Turn your ideas into shipped software with a structured spec, build, review, and deploy workflow.</p>
          <div className="about-page__cta-group">
            <Link className="about-page__btn about-page__btn--primary" to="/contact">
              Start Mentorship
            </Link>
            <Link className="about-page__btn about-page__btn--secondary" to="/projects">
              See Workflow
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AboutMe;
