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
export { test, getUsers, getTemplates, sendMessage };
