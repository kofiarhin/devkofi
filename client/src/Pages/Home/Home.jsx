import { Link } from "react-router-dom";
import { CheckCircle, Plugs, Brain, Stack } from "@phosphor-icons/react";
import { profileImage, profileImageSecondary } from "../../constants/constants";
import { caseStudies, homeFaq, howItWorks, positioning, services } from "../../constants/siteOffer";
import AiDemo from "../../components/Site/AiDemo";
import {
  BookCallButton,
  CalendlyLink,
  Faq,
  FinalCta,
  FloatingPanels,
  PageHero,
  Parallax,
  Reveal,
  Section,
  SectionHeader,
  ShowcaseCard,
  SiteLink,
  Steps,
} from "../../components/Site/Site";

const heroPoints = ["AI integration for businesses", "1-on-1 AI engineering mentorship", "1-on-1 MERN stack mentorship"];

const HeroPortrait = () => (
  <figure className="site-portrait site-portrait--home">
    <div className="site-portrait__backdrop" aria-hidden="true" />
    <img src={profileImage} alt="Kofi Arhin, AI engineer and founder of DevKofi" width="880" height="1100" fetchPriority="high" />
    <figcaption className="site-portrait__badge">
      <span aria-hidden="true" />
      Kofi Arhin · AI engineer
    </figcaption>
    <FloatingPanels />
  </figure>
);

const serviceIcons = [Plugs, Brain, Stack];

const Home = () => (
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
      tone="raised"
      eyebrow="Services"
      title={
        <>
          Built for businesses first. Mentorship for <span className="site-gradient-text">developers.</span>
        </>
      }
      body="One engineer, three ways to work together."
    >
      <div className="site-services-editorial">
        <Reveal className="site-services-editorial__video">
          <iframe
            src="https://www.youtube-nocookie.com/embed/YRVh1yhP51g"
            title="DevKofi — AI integration and mentorship"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
          <noscript>
            <a href="https://youtu.be/YRVh1yhP51g" target="_blank" rel="noreferrer">
              Watch on YouTube
            </a>
          </noscript>
        </Reveal>
        <div className="site-services-editorial__grid">
          {services.map((service, index) => {
            const Icon = serviceIcons[index];
            return (
              <Reveal as="article" className={`site-services-editorial__item${index === 0 ? " site-service--featured" : ""}`} key={service.id} delay={index * 0.08}>
                <span className="site-icon" aria-hidden="true">
                  <Icon size={24} weight="duotone" />
                </span>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                <SiteLink to={service.to}>{service.cta}</SiteLink>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>

    <Section
      eyebrow="Case studies"
      title="Real systems, built and shipped."
      body="AI agents, AI-powered products and full-stack MERN applications, built around practical problems."
    >
      <div className="site-showcase">
        <div className="site-showcase__stack">
          {caseStudies.map((study, index) => (
            <ShowcaseCard key={study.id} study={study} delay={index * 0.1} />
          ))}
        </div>
        <div className="site-actions">
          <SiteLink to="/work">View all work</SiteLink>
        </div>
      </div>
    </Section>

    <Section eyebrow="How it works" title="Three steps from first call to real progress.">
      <Steps steps={howItWorks} />
    </Section>

    <Section tone="raised">
      <div className="site-split">
        <Parallax offset={30} className="site-split__media">
          <img src={profileImageSecondary} alt="Kofi Arhin" width="880" height="1100" loading="lazy" decoding="async" />
        </Parallax>
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

export default Home;
