const FALLBACK_PROD_URL = "https://devkofi-883f1d7b0ba0.herokuapp.com";
export const baseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : FALLBACK_PROD_URL);
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
