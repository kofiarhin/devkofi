import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getSeoForPath, SITE_NAME, SITE_URL } from "../../constants/seo";
import "./studio.styles.scss";

const upsertMeta = (attribute, key, content) => {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const upsertCanonical = (href) => {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

const upsertStructuredData = (structuredData) => {
  const scriptId = "devkofi-page-jsonld";
  const existing = document.getElementById(scriptId);

  if (!structuredData) {
    existing?.remove();
    return;
  }

  const script = existing || document.createElement("script");
  script.id = scriptId;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(structuredData);
  if (!existing) document.head.appendChild(script);
};

export const PageMeta = ({ title, description }) => {
  const location = useLocation();
  const routeMeta = getSeoForPath(location.pathname);
  const pageTitle = routeMeta.title || (title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | AI Engineering Studio`);
  const pageDescription = routeMeta.description || description || "DevKofi AI Engineering Studio.";
  const canonicalUrl = new URL(routeMeta.canonicalPath || location.pathname, SITE_URL).toString();
  const robots = routeMeta.robots || "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

  useEffect(() => {
    document.title = pageTitle;
    upsertMeta("name", "description", pageDescription);
    upsertMeta("name", "robots", robots);
    upsertMeta("name", "author", "Kofi Arhin");

    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:title", pageTitle);
    upsertMeta("property", "og:description", pageDescription);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", routeMeta.image);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", pageTitle);
    upsertMeta("name", "twitter:description", pageDescription);
    upsertMeta("name", "twitter:image", routeMeta.image);

    upsertCanonical(canonicalUrl);
    upsertStructuredData(routeMeta.structuredData);
  }, [canonicalUrl, pageDescription, pageTitle, robots, routeMeta.image, routeMeta.structuredData]);

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
  const projectTitle = project.name || project.title;
  const projectDescription = project.shortDescription || project.engineeringSummary || project.description;
  return (
    <article className="studio-project-card">
      <div className="studio-project-card__media">
        {project.thumbnailUrl ? (
          <img src={project.thumbnailUrl} alt={`${projectTitle} preview`} loading="lazy" />
        ) : (
          <div className="studio-project-card__placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="studio-project-card__body">
        <div className="studio-project-card__meta">
          <span>{project.category || "Engineering"}</span>
          {project.status && <span>{project.status}</span>}
        </div>
        <h3>{projectTitle}</h3>
        {projectDescription && <p>{projectDescription}</p>}
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
