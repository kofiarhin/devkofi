import { Link } from "react-router-dom";
import { CheckCircle } from "@phosphor-icons/react";
import { profileImage, profileImageSecondary } from "../../constants/constants";
import { caseStudies, homeFaq, howItWorks, positioning, services } from "../../constants/siteOffer";
import AiDemo from "../../components/Site/AiDemo";
import {
  BookCallButton,
  CalendlyLink,
  CaseStudyTeaser,
  Checklist,
  Faq,
  FinalCta,
  PageHero,
  Reveal,
  Section,
  SectionHeader,
  SiteLink,
  Steps,
} from "../../components/Site/Site";

const heroPoints = ["AI integration for businesses", "1-on-1 AI engineering mentorship", "1-on-1 MERN stack mentorship"];

const HeroPortrait = () => (
  <figure className="site-portrait site-portrait--home">
    <img src={profileImage} alt="Kofi Arhin, AI engineer and founder of DevKofi" width="880" height="1100" fetchPriority="high" />
    <figcaption className="site-portrait__badge">
      <span aria-hidden="true" />
      Kofi Arhin · AI engineer
    </figcaption>
  </figure>
);

const ServiceCard = ({ service, featured = false, delay = 0 }) => (
  <Reveal as="article" className={`site-card site-service ${featured ? "site-service--featured" : ""}`.trim()} delay={delay}>
    <p className="site-eyebrow">{service.eyebrow}</p>
    <h3>{service.title}</h3>
    <p>{service.body}</p>
    <Checklist items={service.points} />
    <SiteLink to={service.to}>{service.cta}</SiteLink>
  </Reveal>
);

const Home = () => {
  const [leadService, ...mentorshipServices] = services;

  return (
    <main className="site-page">
      <PageHero
        eyebrow={positioning.eyebrow}
        title={
          <>
            AI that works inside the systems <span className="site-gradient-text">you already run.</span>
          </>
        }
        body={positioning.body}
        aside={<HeroPortrait />}
      >
        <div className="site-actions">
          <BookCallButton />
          <Link className="site-button site-button--secondary" to="/work">
            See the work
          </Link>
          <CalendlyLink />
        </div>
        <ul className="site-hero-points">
          {heroPoints.map((point) => (
            <li key={point}>
              <CheckCircle size={18} weight="fill" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="site-section ai-demo-strip" aria-labelledby="ai-demo-heading">
        <div className="site-container">
          <SectionHeader
            id="ai-demo-heading"
            eyebrow="AI at work"
            title="See what an integration does."
            body="A request comes in, the AI works through clear steps using your existing systems, and a person stays in control of the outcome."
          />
          <Reveal delay={0.1}>
            <AiDemo />
          </Reveal>
        </div>
      </section>

      <Section
        eyebrow="Services"
        title="Built for businesses first. Mentorship for developers."
        body="One engineer, three ways to work together."
      >
        <div className="site-services">
          <ServiceCard service={leadService} featured />
          {mentorshipServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} delay={0.08 * (index + 1)} />
          ))}
        </div>
      </Section>

      <Section
        tone="raised"
        eyebrow="Case studies"
        title="Real systems, built and shipped."
        body="An AI agent, an AI-powered personal operating system and a live MERN e-commerce store."
      >
        <div className="site-grid site-grid--3">
          {caseStudies.map((study, index) => (
            <CaseStudyTeaser key={study.id} study={study} delay={index * 0.08} />
          ))}
        </div>
        <div className="site-actions">
          <SiteLink to="/work">See all the work</SiteLink>
        </div>
      </Section>

      <Section eyebrow="How it works" title="Three steps from first call to real progress.">
        <Steps steps={howItWorks} />
      </Section>

      <Section tone="raised">
        <div className="site-split">
          <Reveal className="site-split__media">
            <img src={profileImageSecondary} alt="Kofi Arhin" width="880" height="1100" loading="lazy" decoding="async" />
          </Reveal>
          <div>
            <SectionHeader
              eyebrow="About Kofi"
              title="Software engineering discipline, applied to AI."
              body="I'm a full-stack engineer who builds AI systems, agentic workflows and AI-native products. Models still need architecture, context, tools, permissions, verification and good interfaces around them. That surrounding engineering is what I do."
            />
            <SiteLink to="/about">More about me</SiteLink>
          </div>
        </div>
      </Section>

      <Section eyebrow="FAQ" title="Questions people ask first.">
        <Faq items={homeFaq} />
      </Section>

      <FinalCta />
    </main>
  );
};

export default Home;
