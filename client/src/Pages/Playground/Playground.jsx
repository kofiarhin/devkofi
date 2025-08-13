import GitHubHeatMap from "../../components/GitHubHeatMap/GitHubHeatMap";
import useGithubInfoQuery from "../../hooks/useGithubInfoQuery";

const Playground = () => {
  const { data } = useGithubInfoQuery();
  console.log({ data });
  return (
    <div className="container">{data && <GitHubHeatMap data={data} />}</div>
  );
};

export default Playground;
