import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./about.styles.scss";
import { profileImage } from "../../constants/constants";

const trustStats = [
  { label: "Apps shipped", value: "12+" },
  { label: "Years mentoring", value: "5+" },
  { label: "Workflow focus", value: "AI" },
];

const methodSteps = [
  {
    number: "01",
    title: "Scope the product",
    body: "Clarify the user, constraints, risks, and acceptance criteria before any agent starts writing code.",
  },
  {
    number: "02",
    title: "Write the implementation spec",
    body: "Turn the idea into a buildable plan with files, data flow, states, tests, and deployment requirements.",
  },
  {
    number: "03",
    title: "Build with agent discipline",
    body: "Use Claude Code, Codex, and review loops without outsourcing your architecture or judgment.",
  },
  {
    number: "04",
    title: "Review, test, and deploy",
    body: "Tighten generated work through code review, targeted tests, production checks, and iteration.",
  },
];

const capabilities = [
  {
    label: "AI coding workflows",
    title: "From prompts to controlled delivery",
    body: "Structure agent sessions around specs, acceptance criteria, diffs, and review instead of loose chat.",
    evidence: "Codex, Claude Code, review loops",
  },
  {
    label: "MERN architecture",
    title: "Systems that can be explained",
    body: "Design React, Express, and MongoDB flows with clear ownership, validation, and maintainable boundaries.",
    evidence: "React, Node, Express, MongoDB",
  },
  {
    label: "Review and debugging",
    title: "Sharper judgment over generated code",
    body: "Learn to inspect assumptions, find brittle logic, reduce rework, and defend technical decisions.",
    evidence: "Diff review, test strategy, risk checks",
  },
  {
    label: "Deployment readiness",
    title: "Local demos become production paths",
    body: "Prepare apps for real environments with configuration, API discipline, secure data handling, and release checks.",
    evidence: "Heroku backend, Namecheap frontend",
  },
];

const outcomes = [
  { from: "Prompt experiments", to: "Repeatable build workflow" },
  { from: "Generated snippets", to: "Maintainable architecture" },
  { from: "Local demo", to: "Production deployment path" },
];

const AboutMe = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.12 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const revealClass = isVisible ? "is-revealed" : "";

  return (
    <section className={`about-page ${revealClass}`} ref={sectionRef} aria-label="About Kofi">
      <div className="about-page__container">
        <header className="about-page__hero">
          <div className="about-page__hero-copy">
            <p className="about-page__eyebrow">About DevKofi</p>
            <h1 className="about-page__title">Build software with AI without losing engineering judgment</h1>
            <p className="about-page__lead">
              I am <strong>Kofi</strong>, a senior MERN engineer helping developers use AI coding agents
              to plan, build, review, and ship production software with discipline.
            </p>

            <div className="about-page__cta-group" aria-label="About page actions">
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

          <figure className="about-page__portrait-panel">
            <img
              className="about-page__profile-img"
              src={profileImage}
              alt="Kofi, AI engineering mentor and full-stack engineer"
              loading="eager"
            />
            <figcaption className="about-page__proof-strip">
              MERN systems, AI coding agents, code review, deployment
            </figcaption>
          </figure>
        </header>

        <section className="about-page__belief" id="about-philosophy" aria-labelledby="about-belief-title">
          <p className="about-page__section-kicker">Mentorship philosophy</p>
          <h2 className="about-page__belief-title" id="about-belief-title">
            AI can accelerate delivery, but senior engineering still comes from{" "}
            <span>scope, architecture, review, testing, and ownership.</span>
          </h2>
        </section>

        <section className="about-page__method" id="about-process" aria-labelledby="about-method-title">
          <div className="about-page__section-heading">
            <p className="about-page__section-kicker">From prompt to production</p>
            <h2 className="about-page__section-title" id="about-method-title">
              How we work
            </h2>
            <p>
              The work is practical: define the target, write the spec, use agents inside a controlled
              build loop, then review and ship the result.
            </p>
          </div>

          <ol className="about-page__method-list">
            {methodSteps.map((step) => (
              <li className="about-page__method-item" key={step.number}>
                <span className="about-page__method-number">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-page__capabilities" aria-labelledby="about-capabilities-title">
          <div className="about-page__section-heading">
            <p className="about-page__section-kicker">Capabilities</p>
            <h2 className="about-page__section-title" id="about-capabilities-title">
              The technical range behind the mentorship
            </h2>
          </div>

          <div className="about-page__capability-grid">
            {capabilities.map((capability) => (
              <article className="about-page__capability" key={capability.label}>
                <p className="about-page__capability-label">{capability.label}</p>
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
                <span>{capability.evidence}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="about-page__outcomes" id="about-outcomes" aria-labelledby="about-outcomes-title">
          <div className="about-page__section-heading">
            <p className="about-page__section-kicker">What changes</p>
            <h2 className="about-page__section-title" id="about-outcomes-title">
              What you learn to do
            </h2>
          </div>

          <div className="about-page__outcome-list">
            {outcomes.map((outcome) => (
              <div className="about-page__outcome-row" key={outcome.from}>
                <div>
                  <span>From</span>
                  <strong>{outcome.from}</strong>
                </div>
                <div>
                  <span>To</span>
                  <strong>{outcome.to}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-page__story" aria-labelledby="about-story-title">
          <div className="about-page__section-heading">
            <p className="about-page__section-kicker">Why I mentor</p>
            <h2 className="about-page__section-title" id="about-story-title">
              Developers need more than generated code.
            </h2>
          </div>

          <div className="about-page__story-copy">
            <p className="about-page__story-lead">
              I built DevKofi for developers who want to become the engineer who can guide the tool,
              evaluate the output, and own the system.
            </p>
            <p>
              We work through the full delivery path: scoping, technical planning, agent-assisted builds,
              code review, test strategy, deployment, and iteration.
            </p>
            <p>
              If your goal is to build production MERN apps with AI as part of your engineering workflow,
              the mentorship is designed for that path.
            </p>
          </div>
        </section>

        <section className="about-page__final-cta" id="about-cta" aria-label="Apply for mentorship">
          <div>
            <p className="about-page__section-kicker">Start the work</p>
            <h2>Ready to build with AI like an engineer?</h2>
            <p>
              Bring a product idea, codebase, or workflow problem. We will turn it into a practical build plan.
            </p>
          </div>
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
