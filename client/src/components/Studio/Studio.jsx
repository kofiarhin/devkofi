import { Link } from "react-router-dom";
import "./studio.styles.scss";

export const PageMeta = ({ title, description }) => {
  if (typeof document !== "undefined") {
    document.title = title ? `${title} | DevKofi` : "DevKofi | AI Engineering Studio";
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute("content", description);
  }
  return null;
};

export const SectionHeading = ({ eyebrow, title, body }) => (
  <div className="studio-heading">
    {eyebrow && <p className="studio-eyebrow">{eyebrow}</p>}
    <h2>{title}</h2>
    {body && <p className="studio-copy">{body}</p>}
  </div>
);

export const SplitSection = ({ eyebrow, title, body, image, alt = "", mediaLeft = false, children, id }) => (
  <section className={`studio-split ${mediaLeft ? "studio-split--media-left" : ""}`} id={id}>
    <div className="studio-container studio-split__grid">
      <div className="studio-split__media">
        {image && <img src={image} alt={alt} loading="lazy" />}
      </div>
      <div className="studio-split__content">
        <SectionHeading eyebrow={eyebrow} title={title} body={body} />
        {children}
      </div>
    </div>
  </section>
);

export const ProjectCard = ({ project }) => {
  const title = project.name || project.title;
  const description = project.shortDescription || project.engineeringSummary || project.description;
  return (
    <article className="studio-project-card">
      <div className="studio-project-card__media">
        {project.thumbnailUrl ? (
          <img src={project.thumbnailUrl} alt={`${title} preview`} loading="lazy" />
        ) : (
          <div className="studio-project-card__placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="studio-project-card__body">
        <div className="studio-project-card__meta">
          <span>{project.category || "Engineering"}</span>
          {project.status && <span>{project.status}</span>}
        </div>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        <div className="studio-actions">
          {project.demoUrl && <a className="studio-link" href={project.demoUrl} target="_blank" rel="noreferrer">Live demo</a>}
          {project.repoUrl && <a className="studio-link" href={project.repoUrl} target="_blank" rel="noreferrer">Repository</a>}
        </div>
      </div>
    </article>
  );
};

export const ProjectCollection = ({ projects, emptyMessage }) => {
  if (!projects?.length) return <p className="studio-empty">{emptyMessage}</p>;
  return <div className="studio-project-grid">{projects.map((project) => <ProjectCard key={project._id || project.id || project.slug || project.name} project={project} />)}</div>;
};

export const FinalCta = ({ title = "Have an AI system you want to build?", body = "Bring the problem, prototype, or existing product. I’ll help turn it into an engineering plan and production path." }) => (
  <section className="studio-final-cta">
    <div className="studio-container studio-final-cta__inner">
      <div>
        <p className="studio-eyebrow">Start the conversation</p>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <Link className="studio-button studio-button--primary" to="/contact">Contact</Link>
    </div>
  </section>
);

export const StudioPageHero = ({ eyebrow, title, body, image, alt = "" }) => (
  <section className="studio-page-hero">
    <div className="studio-container studio-page-hero__grid">
      {image && <div className="studio-page-hero__media"><img src={image} alt={alt} /></div>}
      <div className="studio-page-hero__copy">
        <p className="studio-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
    </div>
  </section>
);
