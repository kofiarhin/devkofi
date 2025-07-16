import { baseUrl } from "../constants/constants";

const test = async () => {
  return { message: "get users" };
};

const getUsers = async () => {
  try {
    const url = "http://localhost:5000";
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data);
    }
    return { success: true, data };
  } catch (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }
};

const getTemplates = async () => {
  try {
    const url = "http://localhost:5000/api/templates";
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data);
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// send message
const sendMessage = async (messageData) => {
  const url = import.meta.env.DEV
    ? "http://localhost:5000/api/contact"
    : `${baseUrl}/api/contact`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageData),
  });
  const data = await res.json();
  console.log("xxxx", data);
  return { message: "testing mic" };

  try {
    const res = await fetch(url, {
      headers: {
        "content-type": "äpplication/json",
      },
      method: "POST",
      body: JSON.stringify(messageData),
    });
    const data = await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
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

const joinMentorship = async (data) => {
  try {
    const res = await fetch("/api/mentorship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // Check HTTP status — fetch only rejects on network/CORS errors
    if (!res.ok) {
      const errText = await res.text();
      console.error(`Server error (${res.status}):`, errText);
      return { success: false, status: res.status, error: errText };
    }

    // Parse and return JSON
    const payload = await res.json();
    console.log("Success:", payload);
    return { success: true, data: payload };
  } catch (err) {
    // Network/CORS errors, parsing errors, etc.
    console.error("Fetch failed:", err);
    return { success: false, error: err.message };
  }
};

export {
  test,
  getUsers,
  getTemplates,
  sendMessage,
  downloadFile,
  joinMentorship,
};
