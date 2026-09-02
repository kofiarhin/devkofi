import useProjects from "../../hooks/useProjects";
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
        title="AI Engineering Work"
        description="Selected DevKofi engineering work across AI workflow systems, agents, and full-stack products."
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
            eyebrow="Selected products"
            title="Broader engineering work."
            body="Shipped applications and systems across full-stack product engineering."
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
