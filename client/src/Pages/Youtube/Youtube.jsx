import { useEffect } from "react";
import { baseUrl } from "../../constants/constants";
import useYoutubeQuery from "../../hooks/useYoutubeQuery";
import Spinner from "../../components/Spinner/Spinner";
import YoutubeList from "../../components/YoutubeList/YoutubeList";

const Youtube = () => {
  const { data, isLoading } = useYoutubeQuery();

  if (isLoading) {
    return <Spinner />;
  }
  return <div className="container">{data && <YoutubeList data={data} />}</div>;
};

export default Youtube;
