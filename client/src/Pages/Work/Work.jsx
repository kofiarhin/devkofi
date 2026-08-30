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
      <PageMeta title="AI Engineering Work" description="Curated DevKofi AI engineering case studies, systems, and product work." />
      <StudioPageHero eyebrow="Work" title="Things I have engineered." body="A curated portfolio of AI agents, context infrastructure, full-stack systems, and products selected for the engineering story they demonstrate—not a dump of every repository." image={aiImage} alt="DevKofi AI engineering work" />
      <section className="studio-projects-section">
        <div className="studio-container">
          {isLoading && <p className="studio-empty">Loading engineering work...</p>}
          {isError && <div className="studio-empty"><p>Engineering work could not be loaded.</p><button type="button" className="studio-button studio-button--secondary" onClick={() => refetch()}>Try again</button></div>}
          {!isLoading && !isError && <ProjectCollection projects={work} emptyMessage="Curated engineering work is temporarily unavailable." />}
        </div>
      </section>
      <FinalCta title="Have a similar system to build?" />
    </main>
  );
};

export default Work;
