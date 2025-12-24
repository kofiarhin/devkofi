import React from "react";
import { dataTagErrorSymbol, useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../constants/constants";
import ProjectsList from "../../components/ProjectList/ProjectList";

const Projects = () => {
  const getProjects = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/projects`);
      if (!res.ok) {
        throw new Error("something went wrong");
      }

      const data = await res.json();

      return data;
    } catch (error) {
      console.log(error.message);
    }
  };

  const { data } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  return (
    <div className="container">{data && <ProjectsList projects={data} />}</div>
  );
};

export default Projects;
