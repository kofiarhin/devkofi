import { buildApiUrl } from "../lib/api";

// send message
const sendMessage = async (messageData) => {
  const url = buildApiUrl("/api/contact");
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
    const apiUrl = buildApiUrl(
      `/api/download?filename=${encodeURIComponent(fileName)}`
    );
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
  const url = buildApiUrl(`/api/info/github?query=${encodeURIComponent(query)}`);
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export { sendMessage, downloadFile, getGitHubInfo };
