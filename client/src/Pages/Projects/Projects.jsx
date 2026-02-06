import React from "react";
import "./projects.styles.scss";

import useProjects from "../../hooks/useProjects";
import Spinner from "../../components/Spinner/Spinner";
import ProjectList from "../../components/ProjectList/ProjectList";

const Projects = () => {
  const { data, isLoading, error } = useProjects();

  const projects = Array.isArray(data?.projects) ? data.projects : [];

  return (
    <div className="container">
      <section id="projects" className="projects-page">
        {isLoading ? (
          <div className="projects-loading">
            <Spinner />
          </div>
        ) : error ? (
          <div className="projects-state">
            <h1 className="projects-title">Projects</h1>
            <p className="projects-subtitle">
              Something went wrong while loading projects.
            </p>
          </div>
        ) : (
          <ProjectList data={projects} />
        )}
      </section>
    </div>
  );
};

export default Projects;
