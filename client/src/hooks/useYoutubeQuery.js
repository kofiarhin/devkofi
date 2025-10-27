import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";
const getVideos = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/youtube`);
    if (!res.ok) {
      throw new Error("something went wrong");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const useYoutubeQuery = () => {
  return useQuery({
    queryKey: ["youtube"],
    queryFn: getVideos,
  });
};

export default useYoutubeQuery;
