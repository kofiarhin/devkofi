import { useEffect, useRef, useState } from "react";
import "./about.styles.scss";
import { profileImage } from "../../constants/constants";

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
    <section
      className={`bio-section ${revealClass}`}
      ref={sectionRef}
      aria-label="About Kofi"
    >
      <div className="bio-section__wrapper">
        <div className="bio-section__visual">
          <div className="bio-section__image-glow"></div>
          <img
            className="bio-section__profile-img"
            src={profileImage}
            alt="Kofi"
            loading="lazy"
          />
        </div>

        <article className="bio-section__text-block">
          <h2 className="bio-section__heading">About Me</h2>

          <div className="bio-section__description">
            <p className="bio-section__lead">
              I’m <strong>Kofi</strong> — a full-stack software engineer and
              founder of DevKofi.
            </p>

            <p>
              I build production-ready MERN applications end to end. Real
              products with users, edge cases, performance constraints, and
              systems that have to hold up in the real world.
            </p>

            <p>
              My work spans{" "}
              <span className="text-highlight">React, Node.js, MongoDB</span>,
              APIs, authentication, dashboards, and deployments. I focus on
              clean UI, fast UX, and shipping features that solve real problems.
            </p>

            <p>
              DevKofi exists because most people learn how to code, but not how
              to build. I teach how to design systems, make trade-offs, debug
              confidently, and ship complete applications the way it’s done in
              practice.
            </p>

            <p>
              Alongside engineering, I work heavily in design and visual
              direction. I care about products that feel considered, usable, and
              well-crafted.
            </p>

            <p>
              You can explore more of my design work on{" "}
              <a
                className="bio-section__link"
                href="https://www.behance.net/"
                target="_blank"
                rel="noreferrer"
              >
                Behance
              </a>{" "}
              and{" "}
              <a
                className="bio-section__link"
                href="https://dribbble.com/"
                target="_blank"
                rel="noreferrer"
              >
                Dribbble
              </a>
              .
            </p>

            <p>
              If your goal is to become someone who can take an idea and turn it
              into a working product, that’s what I help people do through{" "}
              <strong>DevKofi</strong>.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AboutMe;
