import useProjects from "../../hooks/useProjects";
import { caseStudies } from "../../constants/siteOffer";
import { selectEngineeringSystems, selectWorkProjects } from "../../lib/projectSelectors";
import { CaseStudyFull, FinalCta, PageHero, ProjectCard, Section } from "../../components/Site/Site";

const caseStudyIds = new Set(caseStudies.map((study) => study.id));

const ProjectGrid = ({ projects, isLoading, isError, refetch, loadingMessage, errorMessage, emptyMessage }) => {
  if (isLoading) return <p className="site-status">{loadingMessage}</p>;
  if (isError) {
    return (
      <div className="site-status">
        <p>{errorMessage}</p>
        <button type="button" className="site-button site-button--secondary" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    );
  }
  if (!projects.length) return <p className="site-status">{emptyMessage}</p>;
  return (
    <div className="site-grid site-grid--3">
      {projects.map((project, index) => (
        <ProjectCard key={project.key || project.id} project={project} delay={(index % 3) * 0.08} />
      ))}
    </div>
  );
};

const Work = () => {
  const { data, isLoading, isError, refetch } = useProjects();
  const projects = Array.isArray(data) ? data : data?.data || [];
  const otherProjects = selectWorkProjects(projects).filter((project) => !caseStudyIds.has(project.key));
  const systems = selectEngineeringSystems(projects);
  const gridState = { isLoading, isError, refetch };

  return (
    <main className="site-page">
      <PageHero
        eyebrow="Work"
        title={
          <>
            Things I have <span className="site-gradient-text">engineered.</span>
          </>
        }
        body="AI agents, AI-powered products and full-stack MERN applications, built around practical problems. Each case study covers the problem, what I built and where it stands today."
      />

      <Section eyebrow="Case studies" title="Three builds, start to finish.">
        <div className="site-case-list">
          {caseStudies.map((study, index) => (
            <CaseStudyFull key={study.id} study={study} reverse={index % 2 === 1} />
          ))}
        </div>
      </Section>

      <Section
        id="systems"
        tone="raised"
        className="site-anchor"
        eyebrow="Engineering systems"
        title="The systems behind how I build."
        body="Reusable infrastructure for preserving context, governing agent behaviour, verifying changes and moving software through controlled delivery. Agent System standardises behaviour across runtimes, Context API and Ideas Hub preserve usable context, and Codex Workflow Kit and AI Dev Workspace turn that context into governed delivery loops with explicit approval and verification."
      >
        <ProjectGrid
          projects={systems}
          {...gridState}
          loadingMessage="Loading engineering systems..."
          errorMessage="Engineering systems could not be loaded."
          emptyMessage="Engineering systems are temporarily unavailable."
        />
      </Section>

      <Section eyebrow="More projects" title="Other things I have built.">
        <ProjectGrid
          projects={otherProjects}
          {...gridState}
          loadingMessage="Loading work..."
          errorMessage="Work is temporarily unavailable."
          emptyMessage="More projects are temporarily unavailable."
        />
      </Section>

      <FinalCta
        title="Want this kind of engineering on your system?"
        body="Book a free intro call to talk about an AI integration, or about 1-on-1 mentorship to learn how these systems are built."
      />
    </main>
  );
};

export default Work;
