import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, CheckCircle, Plus } from "@phosphor-icons/react";
import { BOOK_CALL_LABEL, BOOK_CALL_PATH, CALENDLY_INTRO_URL } from "../../constants/booking";
import { getProjectImageProps } from "../../lib/projectMedia";
import "./site.styles.scss";

// ----------------------------------------------------------------
// Reveal animations
// ----------------------------------------------------------------
const revealVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const blurInVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const variantMap = {
  default: revealVariants,
  "blur-in": blurInVariants,
  "scale-in": scaleInVariants,
};

export const Reveal = ({ as = "div", delay = 0, variant = "default", className, children, ...rest }) => {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className} {...rest}>{children}</Tag>;
  }
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      variants={variantMap[variant] || revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

// Parallax wrapper — shifts content vertically as user scrolls
export const Parallax = ({ children, offset = 40, className }) => {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  if (prefersReducedMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};

// ----------------------------------------------------------------
// Buttons and links
// ----------------------------------------------------------------
export const BookCallButton = ({ label = BOOK_CALL_LABEL, variant = "primary", className = "" }) => (
  <Link className={`site-button site-button--${variant} ${className}`.trim()} to={BOOK_CALL_PATH}>
    {label}
    <ArrowRight size={18} weight="bold" aria-hidden="true" />
  </Link>
);

export const CalendlyLink = () => {
  if (!CALENDLY_INTRO_URL) return null;
  return (
    <a className="site-link" href={CALENDLY_INTRO_URL} target="_blank" rel="noreferrer">
      or book via Calendly
      <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
    </a>
  );
};

export const SiteLink = ({ to, children }) => (
  <Link className="site-link" to={to}>
    {children}
    <ArrowRight size={15} weight="bold" aria-hidden="true" />
  </Link>
);

// ----------------------------------------------------------------
// Cinematic Hero
// ----------------------------------------------------------------
export const PageHero = ({ eyebrow, title, body, children, aside }) => (
  <section className={`site-hero ${aside ? "site-hero--split" : ""}`.trim()}>
    <div className="site-hero__glow" aria-hidden="true" />
    <div className="site-container site-hero__grid">
      <Reveal className="site-hero__copy" variant="blur-in">
        {eyebrow && <p className="site-eyebrow">{eyebrow}</p>}
        <h1 className="site-hero__title">{title}</h1>
        {body && <p className="site-hero__body">{body}</p>}
        {children}
      </Reveal>
      {aside && <Reveal className="site-hero__aside" delay={0.15} variant="scale-in">{aside}</Reveal>}
    </div>
  </section>
);

// ----------------------------------------------------------------
// Floating technical panels (decorative hero accents)
// ----------------------------------------------------------------
export const FloatingPanels = () => (
  <div className="site-float-panels" aria-hidden="true">
    <div className="site-float-panel site-float-panel--top-right">
      <span className="site-float-panel__label">agent.tools</span>
      {"tools: [\n  readFile,\n  writeFile,\n  runTests\n]"}
    </div>
    <div className="site-float-panel site-float-panel--bottom-left">
      <span className="site-float-panel__label">verify</span>
      {"✓ 163 tests passed\n✓ lint clean\n✓ build success"}
    </div>
  </div>
);

// ----------------------------------------------------------------
// Sections
// ----------------------------------------------------------------
export const SectionHeader = ({ eyebrow, title, body, id }) => (
  <Reveal className="site-section-header">
    {eyebrow && <p className="site-eyebrow">{eyebrow}</p>}
    <h2 id={id}>{title}</h2>
    {body && <p className="site-lead">{body}</p>}
  </Reveal>
);

export const Section = ({ id, eyebrow, title, body, tone, children, className = "" }) => {
  const headingId = useId();
  return (
    <section
      id={id}
      className={`site-section ${tone ? `site-section--${tone}` : ""} ${className}`.trim()}
      aria-labelledby={title ? headingId : undefined}
    >
      <div className="site-container">
        {title && <SectionHeader eyebrow={eyebrow} title={title} body={body} id={headingId} />}
        {children}
      </div>
    </section>
  );
};

// ----------------------------------------------------------------
// Lists and checklists
// ----------------------------------------------------------------
export const Checklist = ({ items }) => (
  <ul className="site-checklist">
    {items.map((item) => (
      <li key={item}>
        <CheckCircle size={20} weight="duotone" aria-hidden="true" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export const Steps = ({ steps }) => (
  <ol className="site-steps">
    {steps.map((step, index) => (
      <Reveal as="li" className="site-steps__item" key={step.title} delay={index * 0.08}>
        <span className="site-steps__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <h3>{step.title}</h3>
        <p>{step.body}</p>
      </Reveal>
    ))}
  </ol>
);

// ----------------------------------------------------------------
// FAQ accordion
// ----------------------------------------------------------------
export const Faq = ({ items }) => {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="site-faq">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-q${index}`;
        const panelId = `${baseId}-a${index}`;
        return (
          <div className={`site-faq__item ${isOpen ? "is-open" : ""}`.trim()} key={item.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span>{item.question}</span>
                <Plus size={20} weight="bold" aria-hidden="true" className="site-faq__icon" />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="site-faq__answer">
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ----------------------------------------------------------------
// Case studies (legacy, used on Work page)
// ----------------------------------------------------------------
const CaseStudyMedia = ({ study, eager = false }) => (
  <div className="site-case__media">
    {study.image ? (
      <img
        src={study.image}
        alt={study.imageAlt}
        width="1600"
        height="900"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    ) : (
      <div className="site-case__placeholder" aria-hidden="true">
        <span>{study.name}</span>
      </div>
    )}
  </div>
);

export const CaseStudyTeaser = ({ study, delay = 0 }) => (
  <Reveal as="article" className="site-case site-case--teaser" delay={delay}>
    <CaseStudyMedia study={study} />
    <div className="site-case__body">
      <p className="site-case__tag">{study.tag}</p>
      <h3>{study.name}</h3>
      <p>{study.summary}</p>
      <SiteLink to={`/work#${study.id}`}>Read the case study</SiteLink>
    </div>
  </Reveal>
);

export const CaseStudyFull = ({ study, reverse = false }) => (
  <Reveal as="article" className={`site-case site-case--full ${reverse ? "site-case--reverse" : ""}`.trim()} id={study.id}>
    <CaseStudyMedia study={study} />
    <div className="site-case__body">
      <p className="site-case__tag">{study.tag}</p>
      <h3>{study.name}</h3>
      <p className="site-case__summary">{study.summary}</p>
      <dl className="site-case__story">
        <div>
          <dt>Problem</dt>
          <dd>{study.problem}</dd>
        </div>
        <div>
          <dt>What I built</dt>
          <dd>
            <ul>
              {study.built.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Result</dt>
          <dd>{study.result}</dd>
        </div>
      </dl>
      <ul className="site-tags" aria-label={`${study.name} stack`}>
        {study.stack.map((item) => <li key={item}>{item}</li>)}
      </ul>
      {study.links.length > 0 && (
        <div className="site-actions">
          {study.links.map((link) => (
            <a key={link.href} className="site-link" href={link.href} target="_blank" rel="noreferrer">
              {link.label}
              <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
            </a>
          ))}
        </div>
      )}
    </div>
  </Reveal>
);

// ----------------------------------------------------------------
// Cinematic overlapping project showcase
// ----------------------------------------------------------------
export const ShowcaseCard = ({ study, delay = 0 }) => (
  <Reveal as="article" delay={delay} variant="scale-in">
    <div className="site-showcase__card">
      <div className="site-showcase__media">
        {study.image ? (
          <img
            src={study.image}
            alt={study.imageAlt || `${study.name} preview`}
            width="1600"
            height="900"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="site-showcase__placeholder">
            <span>{study.name}</span>
          </div>
        )}
      </div>
      <div className="site-showcase__info">
        <div>
          <p className="site-showcase__tag">{study.tag}</p>
          <h3 className="site-showcase__name">{study.name}</h3>
        </div>
        <Link to={`/work#${study.id}`} className="site-showcase__link">
          Read the case study
          <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </Link>
      </div>
    </div>
  </Reveal>
);

// ----------------------------------------------------------------
// Project cards (for Work page grids)
// ----------------------------------------------------------------
const ProjectImage = ({ src, alt }) => {
  const [status, setStatus] = useState("responsive");
  if (!src || status === "failed") {
    return (
      <div className="site-case__placeholder" role="img" aria-label={`${alt} unavailable`}>
        <span aria-hidden="true">{alt.replace(/ preview$/, "")}</span>
      </div>
    );
  }
  const imageProps = status === "original" ? { src } : getProjectImageProps(src);
  return (
    <img
      {...imageProps}
      alt={alt}
      width="1600"
      height="900"
      loading="lazy"
      decoding="async"
      onError={() => setStatus(imageProps.srcSet ? "original" : "failed")}
    />
  );
};

export const ProjectCard = ({ project, delay = 0 }) => {
  const name = project.name || project.title;
  return (
    <Reveal as="article" className="site-case site-case--teaser" delay={delay}>
      <div className="site-case__media">
        <ProjectImage key={project.thumbnailUrl || "missing"} src={project.thumbnailUrl} alt={`${name} preview`} />
      </div>
      <div className="site-case__body">
        <p className="site-case__tag">{project.category || "Engineering"}</p>
        <h3>{name}</h3>
        {project.description && <p>{project.description}</p>}
        {(project.demoUrl || project.repoUrl) && (
          <div className="site-actions">
            {project.demoUrl && (
              <a className="site-link" href={project.demoUrl} target="_blank" rel="noreferrer">
                Live demo
                <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
              </a>
            )}
            {project.repoUrl && (
              <a className="site-link" href={project.repoUrl} target="_blank" rel="noreferrer">
                Repository
                <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </div>
    </Reveal>
  );
};

// ----------------------------------------------------------------
// Final CTA
// ----------------------------------------------------------------
export const FinalCta = ({
  title = "Let's talk about what you want to build.",
  body = "Start with a free intro call. We'll look at your system or your goals and agree a sensible first step.",
}) => (
  <section className="site-final-cta" aria-label="Book a free intro call">
    <div className="site-container">
      <Reveal className="site-final-cta__panel" variant="scale-in">
        <div className="site-final-cta__glow" aria-hidden="true" />
        <p className="site-eyebrow">Free intro call</p>
        <h2>{title}</h2>
        <p className="site-lead">{body}</p>
        <div className="site-actions site-actions--center">
          <BookCallButton />
          <CalendlyLink />
        </div>
      </Reveal>
    </div>
  </section>
);
