import { baseUrl } from "../constants/constants";

// send message
const sendMessage = async (messageData) => {
  const path = "/api/contact";
  const url = import.meta.env.DEV ? path : `${baseUrl}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageData),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Failed to send message");
  }

  return data;
};

const downloadFile = async (fileName = "default") => {
  try {
    const apiUrl = import.meta.env.DEV
      ? `http://localhost:5000/api/download?filename=${fileName}`
      : `${baseUrl}/api/download?name=${fileName}`;
    const response = await fetch(apiUrl, {
      method: "GET",
    });
    if (!response.ok) throw new Error("Network response was not ok");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // Filename
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    return true;
  } catch (error) {
    console.error("Download error:", error);
  }
};

// src/services/services.js
const getGitHubInfo = async (query = "daily") => {
  const url = import.meta.env.DEV
    ? "http://localhost:5000/api/info/github?query=daily"
    : `${baseUrl}/api/info/github?query=daily`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export { sendMessage, downloadFile, getGitHubInfo };
