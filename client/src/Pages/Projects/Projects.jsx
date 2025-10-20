import { useEffect } from "react";
import { baseUrl } from "../../constants/constants";
import useProjects from "../../hooks/useProjects";
import Spinner from "../../components/Spinner/Spinner";
import ProjectList from "../../components/ProjectList/ProjectList";
const Projects = () => {
  const { data, isLoading } = useProjects();

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div>
     
      {data && data?.projects?.length > 0 && (
        <ProjectList data={data?.projects} />
      )}
    </div>
  );
};

export default Projects;
