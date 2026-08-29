import useProjects from "../../hooks/useProjects";
import { selectWorkProjects } from "../../lib/projectSelectors";
import { aiImage } from "../../constants/constants";
import { FinalCta, PageMeta, ProjectCollection, StudioPageHero } from "../../components/Studio/Studio";

const Work = () => {
  const { data, isLoading, isError, refetch } = useProjects();
  const projects = Array.isArray(data) ? data : data?.data || [];
  const work = selectWorkProjects(projects);

  return (
    <main>
      <PageMeta title="AI Engineering Work" description="Curated DevKofi AI engineering case studies and systems work." />
      <StudioPageHero eyebrow="Work" title="Engineering proof, not a repository dump." body="A curated set of systems that demonstrate how I approach agents, context, full-stack architecture, integration, verification and production constraints." image={aiImage} alt="DevKofi AI engineering work" />
      <section className="studio-projects-section">
        <div className="studio-container">
          {isLoading && <p className="studio-empty">Loading engineering work...</p>}
          {isError && <div className="studio-empty"><p>Engineering work could not be loaded.</p><button type="button" className="studio-button studio-button--secondary" onClick={() => refetch()}>Try again</button></div>}
          {!isLoading && !isError && <ProjectCollection projects={work} emptyMessage="No AI engineering projects are classified for this view yet. Existing project data remains unchanged until it is explicitly classified." />}
        </div>
      </section>
      <FinalCta title="Have a similar system to build?" />
    </main>
  );
};

export default Work;
