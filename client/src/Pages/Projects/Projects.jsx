import { useEffect } from "react";

const Projects = () => {
  useEffect(() => {
    const fetchProjects = async () => {
      const url = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(url);
      console.log(res.ok);
    };

    fetchProjects();
  }, []);
  return <div>Projects</div>;
};

export default Projects;
