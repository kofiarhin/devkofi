import { useEffect } from "react";
import { baseUrl } from "../../constants/constants";

const Youtube = () => {
  useEffect(() => {
    const getVideos = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/youtube`);
        if (!res.ok) {
          throw new Error("something went wrong");
        }
        const data = await res.json();
        console.log({ data });
      } catch (error) {
        console.log(error.message);
      }
    };
    getVideos();
  }, []);
  return (
    <div>
      <h1 className="heading center">Youtube</h1>
    </div>
  );
};

export default Youtube;
