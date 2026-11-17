import { Link } from "react-router-dom";
import { Brain, Database, FlowArrow, Plugs, Robot, ShieldCheck } from "@phosphor-icons/react";
import { caseStudies, integrationFaq, integrationFit, integrationKinds, integrationProcess } from "../../constants/siteOffer";
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
  Steps,
} from "../../components/Site/Site";

const kindIcons = [Database, Robot, FlowArrow, Plugs, Brain, ShieldCheck];

// Hibachi and Brain are the AI-integration evidence; EscoWear shows the MERN foundation they plug into.
const relevantStudies = caseStudies.filter((study) => ["hibachi", "brain"].includes(study.id));

const AiIntegration = () => (
  <main className="site-page">
    <PageHero
      eyebrow="AI integration · for businesses"
      title={
        <>
          Add AI to your existing systems, <span className="site-gradient-text">without the rebuild.</span>
        </>
      }
      body="I integrate AI into the software, data and workflows you already run: assistants grounded in your data, governed agents and automation with a human approval step. Engineered, tested and verified like the rest of your product."
      aside={<AiDemo />}
    >
      <div className="site-actions">
        <BookCallButton />
        <Link className="site-button site-button--secondary" to="/work">
          See the work
        </Link>
        <CalendlyLink />
      </div>
    </PageHero>

    <Section eyebrow="Who it is for" title="A good fit if…">
      <Reveal>
        <Checklist items={integrationFit} />
      </Reveal>
    </Section>

    <Section
      tone="raised"
      eyebrow="What I integrate"
      title="Kinds of AI integration."
      body="Each of these is a pattern I have built in my own systems, not a slide."
    >
      <div className="site-grid site-grid--3">
        {integrationKinds.map((kind, index) => {
          const Icon = kindIcons[index % kindIcons.length];
          return (
            <Reveal as="article" className="site-card" key={kind.title} delay={(index % 3) * 0.08}>
              <span className="site-icon" aria-hidden="true">
                <Icon size={24} weight="duotone" />
              </span>
              <h3>{kind.title}</h3>
              <p>{kind.body}</p>
            </Reveal>
          );
        })}
      </div>
    </Section>

    <Section eyebrow="Process" title="Start small, prove it, then expand.">
      <Steps steps={integrationProcess} />
    </Section>

    <Section tone="raised" eyebrow="Case studies" title="Where these patterns come from.">
      <div className="site-grid site-grid--2">
        {relevantStudies.map((study, index) => (
          <CaseStudyTeaser key={study.id} study={study} delay={index * 0.08} />
        ))}
      </div>
    </Section>

    <Section eyebrow="FAQ" title="AI integration questions.">
      <Faq items={integrationFaq} />
    </Section>

    <FinalCta
      title="Have a system that could use AI?"
      body="Book a free intro call. Bring the process or product, and we'll work out whether AI genuinely helps and what a first slice looks like."
    />
  </main>
);

export default AiIntegration;
