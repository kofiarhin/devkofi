const DEV_API_URL = "http://localhost:5000";
const PROD_API_URL = "https://devkofi-883f1d7b0ba0.herokuapp.com";

const normalizeUrl = (url) => {
  if (typeof url !== "string") {
    return url;
  }

  return url.replace(/\/$/, "");
};

export const baseUrl = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL
  : "https://devkofi-api-82532bf8b693.herokuapp.com";

export const profileImage =
  "https://res.cloudinary.com/dlsiabgiw/image/upload/v1753586196/devkofi/bnxcwfcq2mrrv3qio0uf.jpg";
export const codeSnippetImage =
  "https://res.cloudinary.com/dlsiabgiw/image/upload/v1753763160/devkofi/f2bycwqmitsvfzzfyptp.png";

export const aiImage =
  "https://res.cloudinary.com/dlsiabgiw/image/upload/v1754713919/devkofi/nkhpiuk3ez4jv5jtgxl0.png";

export const aboutMeImage =
  "https://res.cloudinary.com/dlsiabgiw/image/upload/v1754808945/devkofi/h1kotd65jlzqqyr1yrjh.png";

export const profileSmall =
  "https://res.cloudinary.com/dlsiabgiw/image/upload/v1754978051/devkofi/pj7bwbv4di9bznwv3qxp.jpg";

export const defaultImage =
  "https://res.cloudinary.com/dlsiabgiw/image/upload/v1760929519/devkofi/h2vx5qbjmtbg0mf8goxr.jpg";

export const workStation =
  "https://res.cloudinary.com/dlsiabgiw/image/upload/v1753669719/devkofi/tri8gqr0qksux018d1bj.png";
export const personCoding =
  "https://res.cloudinary.com/dlsiabgiw/image/upload/v1753666892/devkofi/qam76btza4l1avr6vmic.png";

export const AiImage =
  "https://res.cloudinary.com/dlsiabgiw/image/upload/v1754713919/devkofi/nkhpiuk3ez4jv5jtgxl0.png";

export const codeImage =
  "https://res.cloudinary.com/dlsiabgiw/image/upload/v1753763160/devkofi/f2bycwqmitsvfzzfyptp.png";
