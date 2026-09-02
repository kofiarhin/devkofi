import { Link } from "react-router-dom";
import { engagementOffers } from "../../constants/engagementOffers";
import { services } from "../../constants/services";
import { aiImage, codeSnippetImage, personCoding, workStation } from "../../constants/constants";
import { FinalCta, PageMeta, SectionHeading, SplitSection, StudioPageHero } from "../../components/Studio/Studio";

const visuals = [codeSnippetImage, aiImage, workStation, personCoding, codeSnippetImage, workStation];

const Services = () => (
  <main>
    <PageMeta
      title="AI Engineering Services"
      description="AI workflow audits, pilot sprints, and production AI systems for founder-led teams. Human-controlled agents, integrations, evaluation, and full-stack delivery."
    />
    <StudioPageHero
      eyebrow="Services"
      title="AI engineering for systems that need to work beyond the demo."
      body="I help founders and product teams turn repetitive business workflows and early AI prototypes into dependable, human-controlled software."
      image={aiImage}
      alt="AI engineering system visual"
    />

    <section className="studio-projects-section" id="engagements">
      <div className="studio-container">
        <SectionHeading
          eyebrow="Engagements"
          title="Start with one workflow."
          body="Three clear offers. No broad transformation theatre—just scoped work with validation, oversight, and a path to production."
        />
        <div className="studio-offer-grid">
          {engagementOffers.map((offer) => (
            <article className="studio-offer-card" key={offer.id}>
              {offer.image && (
                <div className="studio-offer-card__media">
                  <img src={offer.image} alt={offer.imageAlt || offer.name} loading="lazy" />
                </div>
              )}
              <p className="studio-offer-card__meta">{offer.duration}</p>
              <h3>{offer.name}</h3>
              <p>{offer.summary}</p>
              <ul>
                {offer.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="studio-actions">
          <Link className="studio-button studio-button--primary" to="/book-a-call">
            Book an AI workflow call
          </Link>
          <Link className="studio-link" to="/contact">
            Send a workflow brief
          </Link>
        </div>
      </div>
    </section>

    {services.map((service, index) => (
      <SplitSection
        key={service.id}
        eyebrow={service.eyebrow}
        title={service.title}
        body={`${service.problem} ${service.description}`}
        image={visuals[index % visuals.length]}
        alt={`${service.title} engineering visual`}
        mediaLeft={index % 2 === 1}
      >
        <ul className="studio-service-points">
          {service.useCases.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SplitSection>
    ))}
    <FinalCta />
  </main>
);

export default Services;
