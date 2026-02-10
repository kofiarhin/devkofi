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
              I build real-world MERN applications from start to finish. The
              kind that have users, edge cases, and the occasional bug that
              makes you stare at the screen wondering what just happened.
            </p>
            <p>
              Over the years, I’ve worked across the full stack —{" "}
              <span className="text-highlight">React, Node.js, MongoDB</span>,
              and everything in between.
            </p>
            <p>
              DevKofi started from a simple place: learning feels a lot easier
              than building. Everything I teach is based on how I actually work.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AboutMe;
