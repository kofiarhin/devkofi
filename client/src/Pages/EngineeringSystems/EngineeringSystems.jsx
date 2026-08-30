import useProjects from "../../hooks/useProjects";
import { selectEngineeringSystems } from "../../lib/projectSelectors";
import { codeSnippetImage } from "../../constants/constants";
import { FinalCta, PageMeta, ProjectCollection, SectionHeading, StudioPageHero } from "../../components/Studio/Studio";

const EngineeringSystems = () => {
  const { data, isLoading, isError, refetch } = useProjects();
  const projects = Array.isArray(data) ? data : data?.data || [];
  const systems = selectEngineeringSystems(projects);

  return (
    <main>
      <PageMeta title="Engineering Systems" description="The reusable workflows, agent infrastructure, context systems, and verification patterns behind DevKofi engineering work." />
      <StudioPageHero eyebrow="Engineering Systems" title="The systems behind how I build." body="Reusable engineering infrastructure for preserving context, reducing ambiguity, governing agent behaviour, verifying changes, and moving software through controlled delivery." image={codeSnippetImage} alt="Code and engineering workflow" />

      <section className="studio-projects-section">
        <div className="studio-container">
          <SectionHeading eyebrow="Core systems" title="Reusable infrastructure, not portfolio duplicates." body="These are the systems I use to make AI-assisted engineering more repeatable, controlled, and evidence-driven." />
          {isLoading && <p className="studio-empty">Loading engineering systems...</p>}
          {isError && <div className="studio-empty"><p>Engineering systems could not be loaded.</p><button type="button" className="studio-button studio-button--secondary" onClick={() => refetch()}>Try again</button></div>}
          {!isLoading && !isError && <ProjectCollection projects={systems} emptyMessage="Engineering systems are temporarily unavailable." />}
        </div>
      </section>

      <section className="studio-system-list">
        <div className="studio-container">
          <SectionHeading eyebrow="How they fit together" title="Context, instructions, workflow, and delivery." body="Agent System standardizes behaviour across runtimes. Context API and Ideas Hub preserve usable context. Codex Workflow Kit and AI Dev Workspace turn that context into governed delivery loops with explicit approval and verification." />
        </div>
      </section>

      <FinalCta title="Need this engineering discipline applied to your AI system?" />
    </main>
  );
};

export default EngineeringSystems;
