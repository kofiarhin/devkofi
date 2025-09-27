import { baseUrl } from "../constants/constants";

const ensureLeadingSlash = (path = "") =>
  path.startsWith("/") ? path : `/${path}`;

const buildApiUrl = (path = "") => `${baseUrl}${ensureLeadingSlash(path)}`;

export { baseUrl, buildApiUrl };
