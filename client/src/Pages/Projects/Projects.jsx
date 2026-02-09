import { useEffect } from "react";

const Projects = () => {
  useEffect(() => {
    const fetchProjects = async () => {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await fetch(`${API_URL}/api/projects`);
      const data = await res.json();
      console.log({ data });
    };

    fetchProjects();
  }, []);
  return <div>Projects</div>;
};

export default Projects;
