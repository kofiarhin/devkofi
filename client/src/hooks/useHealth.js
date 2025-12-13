import { useEffect, useState } from "react";
import { baseUrl } from "../constants/constants";

const useHealth = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    const getHealth = async () => {
      try {
        const res = await fetch(baseUrl);
        if (!res.ok) {
          throw new Error("there was a problem connecting to server");
        }

        const resData = await res.json();

        setData(resData);
      } catch (error) {
        console.log({ error: error.message });
      }
    };
    getHealth();
  }, []);
  return { data };
};

export default useHealth;
