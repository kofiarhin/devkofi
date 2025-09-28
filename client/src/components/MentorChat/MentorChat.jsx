import { useState } from "react";
import useMentor from "../../hooks/useMentor.js";
import { ENABLE_MENTOR } from "../../constants/flags.js";
import styles from "./mentorChat.styles.scss";

const formatCode = (code = "") => {
  if (typeof code !== "string") {
    return "";
  }

  const normalized = code
    .replace(/^```[a-z]*\n?/i, "")
    .replace(/```$/, "")
    .trimEnd();

  return code.endsWith("\n```") ? `${normalized}\n` : normalized;
};

const MentorChat = ({ isEnabled = ENABLE_MENTOR }) => {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const { mutateAsync, isPending } = useMentor();

  if (!isEnabled) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = question.trim();

    if (!trimmed) {
      return;
    }

    const userMessage = { role: "user", content: trimmed };
    const conversation = [...history, userMessage];

    setHistory(conversation);
    setQuestion("");

    try {
      const mentorReply = await mutateAsync({
        question: trimmed,
        history: conversation,
      });

      setHistory((previous) => [
        ...previous,
        { role: "assistant", content: mentorReply },
      ]);
    } catch (error) {
      setHistory((previous) => [
        ...previous,
        {
          role: "assistant",
          content: {
            title: "Request Failed",
            explanation: error.message,
            code: "",
            difficulty: "medium",
            confidence: 0,
          },
        },
      ]);
    }
  };

  const handleCopy = async (code) => {
    const normalized = formatCode(code);

    const clipboard = window.navigator?.clipboard;

    if (!normalized || !clipboard || typeof clipboard.writeText !== "function") {
      return;
    }

    await clipboard.writeText(normalized);
  };

  return (
    <section className={styles.chat} aria-label="AI Coding Mentor chat">
      <div className={styles.history}>
        {history.map((message, index) => {
          if (message.role === "user") {
            return (
              <div
                key={`user-${index}`}
                className={styles.userMessage}
                data-testid="chat-message"
              >
                <p>{message.content}</p>
              </div>
            );
          }

          const { title, explanation, code } = message.content;
          const normalizedCode = formatCode(code);

          return (
            <div
              key={`assistant-${index}`}
              className={styles.assistantMessage}
              data-testid="chat-message"
            >
              <strong>{title}</strong>
              <p>{explanation}</p>
              {normalizedCode ? (
                <div className={styles.codeBlock}>
                  <pre>
                    <code>{normalizedCode}</code>
                  </pre>
                  <button
                    type="button"
                    className={styles.copyButton}
                    onClick={() => handleCopy(code)}
                  >
                    Copy Code
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="mentor-question">
          Ask the mentor
        </label>
        <textarea
          id="mentor-question"
          className={styles.textarea}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Describe your coding question"
          disabled={isPending}
        />
        <button type="submit" className={styles.submit} disabled={isPending}>
          {isPending ? "Sending..." : "Send"}
        </button>
      </form>
    </section>
  );
};

export default MentorChat;
