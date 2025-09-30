import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const askQuestion = async (input) => {
  const payload =
    typeof input === "string"
      ? { question: input, history: [] }
      : {
          question: input?.question,
          history: Array.isArray(input?.history) ? input.history : [],
        };

  if (typeof payload.question !== "string" || !payload.question.trim()) {
    throw new Error("Please provide a valid question.");
  }

  const res = await fetch(`${baseUrl}/api/ask-mentor`, {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      question: payload.question.trim(),
      history: payload.history,
    }),
  });

  const data = await res.json().catch(() => null);
  console.log({ data });

  if (!res.ok) {
    const message = data?.message || "Unable to reach mentor.";
    throw new Error(message);
  }

  return data;
};

const useChatMutation = () =>
  useMutation({
    mutationKey: ["chat"],
    mutationFn: askQuestion,
  });

export default useChatMutation;
