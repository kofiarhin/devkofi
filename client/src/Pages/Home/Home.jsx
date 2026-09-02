import { Link } from "react-router-dom";
import useProjects from "../../hooks/useProjects";
import { engagementOffers, workflowExamples } from "../../constants/engagementOffers";
import { services } from "../../constants/services";
import { studioContent } from "../../constants/siteContent";
import { selectFeaturedWork } from "../../lib/projectSelectors";
import { FinalCta, PageMeta, ProjectCollection, SectionHeading, SplitSection } from "../../components/Studio/Studio";

const Home = () => {
  const { data, isLoading, isError } = useProjects();
  const projects = Array.isArray(data) ? data : data?.data || [];
  const featuredWork = selectFeaturedWork(projects);

  return (
    <main>
      <PageMeta
        title="AI Engineering Studio"
        description="DevKofi turns manual business workflows and early AI prototypes into dependable, human-controlled AI systems for founder-led teams."
      />

      <section className="studio-page-hero">
        <div className="studio-container studio-page-hero__grid">
          <div className="studio-page-hero__media">
            <img src={studioContent.hero.image} alt="Kofi, founder and AI systems engineer at DevKofi" />
          </div>
          <div className="studio-page-hero__copy">
            <p className="studio-eyebrow">{studioContent.hero.eyebrow}</p>
            <h1>{studioContent.hero.title}</h1>
            <p>{studioContent.hero.body}</p>
            <div className="studio-actions">
              <Link className="studio-button studio-button--primary" to="/book-a-call">
                Book an AI workflow call
              </Link>
              <Link className="studio-button studio-button--secondary" to="/engineering-systems">
                See our systems
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="studio-projects-section">
        <div className="studio-container">
          <SectionHeading
            eyebrow={studioContent.whoFor.eyebrow}
            title={studioContent.whoFor.title}
            body={studioContent.whoFor.body}
          />
          <div className="studio-offer-grid">
            {workflowExamples.map((example) => (
              <article className="studio-offer-card" key={example.title}>
                <h3>{example.title}</h3>
                <p>{example.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="studio-projects-section" id="engagements">
        <div className="studio-container">
          <SectionHeading
            eyebrow="Engagements"
            title="Three ways to start."
            body="Start narrow with one workflow. Expand only after the pilot proves reliability on real inputs."
          />
          <div className="studio-offer-grid">
            {engagementOffers.map((offer) => (
              <article className="studio-offer-card" key={offer.id}>
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
            <Link className="studio-link" to="/services">
              View services
            </Link>
          </div>
        </div>
      </section>

      <SplitSection
        eyebrow={services[0].eyebrow}
        title={services[0].title}
        body={`${services[0].description} ${services[0].problem}`}
        image={studioContent.systems.image}
        alt="Code and engineering system used to build AI software"
        mediaLeft
      >
        <div className="studio-actions">
          <Link className="studio-link" to="/services">
            Explore AI Systems Engineering
          </Link>
        </div>
      </SplitSection>

      <section className="studio-projects-section">
        <div className="studio-container">
          <SectionHeading
            eyebrow="Selected work"
            title="Things I have engineered."
            body="Selected products spanning agent engineering, full-stack architecture, and practical workflow systems."
          />
          {isLoading ? (
            <p className="studio-empty">Loading selected work...</p>
          ) : isError ? (
            <p className="studio-empty">Selected work is temporarily unavailable.</p>
          ) : (
            <ProjectCollection
              projects={featuredWork}
              emptyMessage="Selected engineering work is temporarily unavailable."
            />
          )}
          <div className="studio-actions">
            <Link className="studio-link" to="/work">
              View all engineering work
            </Link>
          </div>
        </div>
      </section>

      <section className="studio-projects-section">
        <div className="studio-container">
          <SectionHeading
            eyebrow="Engineering systems"
            title="The systems behind how I build."
            body="Reusable workflows, agent infrastructure, context systems, and delivery controls that make AI-assisted engineering repeatable and reviewable."
          />
          <div className="studio-actions">
            <Link className="studio-link" to="/engineering-systems">
              Explore Engineering Systems
            </Link>
          </div>
        </div>
      </section>

      <SplitSection {...studioContent.viewpoint} alt="Kofi working on software engineering" />
      <FinalCta />
    </main>
  );
};

export default Home;
