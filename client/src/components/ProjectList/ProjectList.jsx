import React from "react";
import "./projectsList.styles.scss";

const ProjectsList = ({ projects = [] }) => {
  return (
    <section id="projects">
      <h1 className="projectsTitle">Projects</h1>

      <div className="projectsGrid">
        {projects.map((project) => (
          <div key={project.id} className="projectCard">
            <div className="projectImagePlaceholder" />

            <h3 className="projectTitle">{project.title}</h3>

            <p className="projectDescription">{project.description}</p>

            <button
              className="demoButton"
              onClick={() => {
                if (project.slug) {
                  window.location.href = `/projects/${project.slug}`;
                }
              }}
            >
              View Demo
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsList;
