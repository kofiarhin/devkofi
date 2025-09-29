const DEV_API_URL = "http://localhost:5000";
const PROD_API_URL = "https://devkofi-883f1d7b0ba0.herokuapp.com";

const normalizeUrl = (url) => {
  if (typeof url !== "string") {
    return url;
  }

  return url.replace(/\/$/, "");
};

export const baseUrl = normalizeUrl(
  import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? DEV_API_URL : PROD_API_URL)
);
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
