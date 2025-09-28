import { useMutation } from "@tanstack/react-query";
import { post } from "../lib/http.js";

const useMentor = () =>
  useMutation({
    mutationFn: async ({ question, history = [] }) =>
      post("/api/mentor/ask", { question, history }),
  });

export default useMentor;
