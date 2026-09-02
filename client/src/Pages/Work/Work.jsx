import useProjects from "../../hooks/useProjects";
import { caseStudies } from "../../constants/caseStudies";
import { aiImage } from "../../constants/constants";
import { selectWorkProjects } from "../../lib/projectSelectors";
import { FinalCta, PageMeta, ProjectCollection, SectionHeading, StudioPageHero } from "../../components/Studio/Studio";

const Work = () => {
  const { data, isLoading, isError } = useProjects();
  const projects = Array.isArray(data) ? data : data?.data || [];
  const portfolioWork = selectWorkProjects(projects);

  return (
    <main>
      <PageMeta
        title="AI Engineering Work & Case Studies"
        description="Selected DevKofi case studies and engineering work across AI workflow systems, agents, and full-stack products."
      />

      <StudioPageHero
        eyebrow="Work"
        title="Things I have engineered."
        body="AI workflow systems and full-stack products built around practical problems, with a focus on how they work and what they help people do."
        image={aiImage}
        alt="AI engineering work visual"
      />

      <section className="studio-projects-section">
        <div className="studio-container">
          <SectionHeading
            eyebrow="Case studies"
            title="Proof over portfolio theatre."
            body="Two systems that show the studio approach: business workflow reliability and governed AI-assisted delivery."
          />
          <div className="studio-offer-grid">
            {caseStudies.map((study) => (
              <article className="studio-offer-card" key={study.id}>
                <p className="studio-offer-card__meta">
                  {study.category} · {study.status}
                </p>
                <h3>{study.name}</h3>
                <p>
                  <strong>Problem.</strong> {study.problem}
                </p>
                <p>
                  <strong>Workflow.</strong> {study.workflow}
                </p>
                <ul>
                  {study.safeguards.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>
                  <strong>Result.</strong> {study.result}
                </p>
                {study.links?.repo && (
                  <div className="studio-actions">
                    <a className="studio-link" href={study.links.repo} target="_blank" rel="noreferrer">
                      Repository
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="studio-projects-section">
        <div className="studio-container">
          <SectionHeading
            eyebrow="Selected products"
            title="Broader engineering work."
            body="Additional shipped applications and systems across full-stack product engineering."
          />
          {isLoading ? (
            <p className="studio-empty">Loading work...</p>
          ) : isError ? (
            <p className="studio-empty">Work is temporarily unavailable.</p>
          ) : (
            <ProjectCollection projects={portfolioWork} emptyMessage="Engineering work is temporarily unavailable." />
          )}
        </div>
      </section>

      <FinalCta />
    </main>
  );
};

export default Work;
