import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../constants/constants";

const askQuestion = async (questionData) => {
  const { text: input, history } = questionData;
  const payload = {
    question: input,
    messages: history,
  };

  if (typeof payload.question !== "string" || !payload.question.trim()) {
    throw new Error("Please provide a valid question.");
  }

  const res = await fetch(`${baseUrl}/api/chat/ask`, {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.error || "Unable to process request.";
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
