import React from "react";
import "./project_list.styles.scss";
import { defaultImage } from "../../constants/constants";
import { Link } from "react-router-dom";

const ProjectList = ({ data = [] }) => {
  if (data?.length === 0) {
    return <p> No projects found </p>;
  }
  return (
    <div id="projects">
      <div className="container">
        {/* projects-wrapper */}
        {data?.map((item) => {
          return (
            <Link to={item?.demoUrl} key={item.id} className="project-unit">
              <img src={item?.thumbnailUrl} />
              <h2> {item.name} </h2>
            </Link>
          );
        })}
        {/* end - projects-wrapper */}
      </div>
    </div>
  );
};

export default ProjectList;
