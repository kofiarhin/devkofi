import { Link } from "react-router-dom";
import { engagementOffers } from "../../constants/engagementOffers";
import { aiImage } from "../../constants/constants";
import { FinalCta, PageMeta, SectionHeading, StudioPageHero } from "../../components/Studio/Studio";

const auditOffer = engagementOffers[0];

const intakeItems = [
  "The manual process that costs the most time or money",
  "Systems and data sources involved today",
  "What a successful outcome would look like in 30 days",
  "Constraints around approvals, security, or compliance",
];

const AiWorkflowAudit = () => (
  <main>
    <PageMeta
      title="AI Workflow Audit"
      description="Map one expensive manual process, identify where AI is appropriate, and leave with a scoped pilot plan for a human-controlled AI system."
    />

    <StudioPageHero
      eyebrow="Engagement · 3–5 days"
      title="AI Workflow Audit"
      body="A focused engagement to map one expensive process, decide where AI belongs, and define a pilot that can be validated on real inputs."
      image={aiImage}
      alt="AI workflow audit planning visual"
    />

    <section className="studio-projects-section">
      <div className="studio-container">
        <SectionHeading
          eyebrow="What you get"
          title="Clarity before build."
          body={auditOffer.summary}
        />
        <div className="studio-offer-grid">
          {auditOffer.outcomes.map((outcome) => (
            <article className="studio-offer-card" key={outcome}>
              <h3>{outcome}</h3>
              <p>Documented clearly enough to approve, reject, or fund a pilot with confidence.</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="studio-projects-section">
      <div className="studio-container">
        <SectionHeading
          eyebrow="What to send"
          title="A useful audit starts with context."
          body="You do not need a polished brief. These four inputs are enough to start."
        />
        <ul className="studio-service-points">
          {intakeItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="studio-actions">
          <Link className="studio-button studio-button--primary" to="/book-a-call">
            Book an AI workflow call
          </Link>
          <Link className="studio-button studio-button--secondary" to="/contact">
            Send a workflow brief
          </Link>
        </div>
      </div>
    </section>

    <FinalCta
      title="Start with one workflow."
      body="If the process is repetitive, data-heavy, and expensive when it fails, an audit is usually the right first step."
    />
  </main>
);

export default AiWorkflowAudit;
