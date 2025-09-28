import { SERVER_BASE_URL } from "../constants/baseUrl.js";

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    throw new Error("Invalid JSON response from mentor API.");
  }
};

const buildHeaders = (token) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const post = async (path, body, token) => {
  const response = await fetch(`${SERVER_BASE_URL}${path}`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = await response.json();
      if (errorBody && typeof errorBody.message === "string") {
        message = errorBody.message;
      }
    } catch (error) {
      // Ignore JSON parsing errors when extracting error message
    }

    throw new Error(message);
  }

  return parseJsonSafely(response);
};

export { post };
