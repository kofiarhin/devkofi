import { useEffect, lazy, Suspense } from "react";
import { baseUrl } from "../../constants/constants";
import useProjects from "../../hooks/useProjects";
import Spinner from "../../components/Spinner/Spinner";

const ProjectList = lazy(() =>
  import("../../components/ProjectList/ProjectList")
);

const Projects = () => {
  const { data, isLoading } = useProjects();

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        {data && data?.projects?.length > 0 && (
          <ProjectList data={data?.projects} />
        )}
      </Suspense>
    </div>
  );
};

export default Projects;
