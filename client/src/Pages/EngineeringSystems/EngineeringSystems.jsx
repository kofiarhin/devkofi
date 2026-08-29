import useProjects from "../../hooks/useProjects";
import { selectEngineeringSystems } from "../../lib/projectSelectors";
import { engineeringSystems } from "../../constants/siteContent";
import { codeSnippetImage } from "../../constants/constants";
import { FinalCta, PageMeta, ProjectCollection, SectionHeading, StudioPageHero } from "../../components/Studio/Studio";

const EngineeringSystems = () => {
  const { data, isLoading } = useProjects();
  const projects = Array.isArray(data) ? data : data?.data || [];
  const systems = selectEngineeringSystems(projects);

  return (
    <main>
      <PageMeta title="Engineering Systems" description="The workflows, agent infrastructure, context systems and verification patterns behind DevKofi engineering work." />
      <StudioPageHero eyebrow="Engineering Systems" title="The systems behind how I build." body="Reusable workflows and infrastructure for turning ambiguous ideas into controlled, reviewable, verifiable engineering work." image={codeSnippetImage} alt="Code and engineering workflow" />
      <section className="studio-system-list">
        <div className="studio-container">
          <SectionHeading eyebrow="Method" title="Repeatable engineering systems." body="These systems reduce ambiguity, preserve context, constrain agent behaviour, and keep verification explicit." />
          <div className="studio-system-grid">
            {engineeringSystems.map((system) => (
              <article className="studio-system-item" key={system.title}>
                <p className="studio-eyebrow">{system.evidence}</p>
                <h3>{system.title}</h3>
                <p>{system.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="studio-projects-section">
        <div className="studio-container">
          <SectionHeading eyebrow="Repository-backed systems" title="Systems represented in the project catalogue." body="Where project records are classified as engineering systems, they appear here with live and repository evidence." />
          {isLoading ? <p className="studio-empty">Loading engineering systems...</p> : <ProjectCollection projects={systems} emptyMessage="No project records are explicitly classified as engineering systems yet. The methodology above remains the documented studio approach." />}
        </div>
      </section>
      <FinalCta title="Need this engineering discipline applied to your AI system?" />
    </main>
  );
};

export default EngineeringSystems;
