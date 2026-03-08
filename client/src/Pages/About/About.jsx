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
    <section className={`bio-section ${revealClass}`} ref={sectionRef} aria-label="About Kofi">
      <div className="bio-section__wrapper">
        <div className="bio-section__visual">
          <div className="bio-section__image-glow"></div>
          <img className="bio-section__profile-img" src={profileImage} alt="Kofi" loading="lazy" />
        </div>

        <article className="bio-section__text-block">
          <h2 className="bio-section__heading">About Me</h2>

          <div className="bio-section__description">
            <p className="bio-section__lead">
              I’m <strong>Kofi</strong> — a full-stack engineer, founder, and the
              mentor behind DevKofi AI-Powered MERN Stack Mentorship.
            </p>
            <p>
              I teach developers how to build and ship real MERN products while
              integrating AI into practical engineering workflows.
            </p>
            <p>
              My philosophy is <span className="text-highlight">engineering-first, AI-enhanced</span>:
              use AI to move faster, but keep architecture quality, debugging
              discipline, and technical judgment at the center.
            </p>
            <p>
              In mentorship, we focus on real product decisions: scoping features,
              reviewing code, refactoring safely, writing meaningful tests,
              documenting decisions, and shipping to production.
            </p>
            <p>
              If you want to become the kind of builder who can take ideas from
              zero to shipped software, this is exactly what I help you do.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AboutMe;
