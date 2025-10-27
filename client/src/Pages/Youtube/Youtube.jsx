import { useEffect } from "react";
import { baseUrl } from "../../constants/constants";
import useYoutubeQuery from "../../hooks/useYoutubeQuery";
import Spinner from "../../components/Spinner/Spinner";

const Youtube = () => {
  const { data, isLoading } = useYoutubeQuery();

  console.log({ data });

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div>
      <h1 className="heading center">Youtube</h1>
    </div>
  );
};

export default Youtube;
