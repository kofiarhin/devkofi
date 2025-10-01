import "./chatBox.styles.scss";
import { useEffect, useRef, useState } from "react";
import useChatMutation from "../hooks/useChatMutation";

const ChatBox = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const { mutate } = useChatMutation();

  useEffect(() => {
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = question.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: "student", text, ts: Date.now() }]);
    setQuestion("");
    setSending(true);

    mutate(text, {
      onSuccess: (data) => {
        // expected dataset: { title, difficulty, confidence, explanation }
        const isDataset =
          data &&
          typeof data === "object" &&
          ("title" in data || "explanation" in data || "difficulty" in data);

        if (isDataset) {
          setMessages((prev) => [
            ...prev,
            { role: "mentor", data, ts: Date.now() },
          ]);
        } else {
          const answer = data?.answer || data?.text || String(data || "");
          setMessages((prev) => [
            ...prev,
            { role: "mentor", text: answer, ts: Date.now() },
          ]);
        }
      },
      onError: () => {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            text: "Something went wrong. Try again.",
            ts: Date.now(),
          },
        ]);
      },
      onSettled: () => setSending(false),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
  };

  const MentorCard = ({ data }) => {
    const { title, difficulty, confidence, explanation } = data || {};
    return (
      <div className="mentor-card">
        {title && <h4 className="mc-title">{title}</h4>}
        {(difficulty || confidence !== undefined) && (
          <div className="mc-meta">
            {difficulty && (
              <span className="tag">Difficulty: {difficulty}</span>
            )}
            {confidence !== undefined && (
              <span className="tag">Confidence: {confidence}</span>
            )}
          </div>
        )}
        {explanation && <p className="mc-expl">{explanation}</p>}
      </div>
    );
  };

  return (
    <div id="chat-box">
      <div className="messages" ref={listRef}>
        {messages.map((m) => (
          <div key={m.ts} className={`message ${m.role}`}>
            {m.role === "mentor" && m.data ? (
              <MentorCard data={m.data} />
            ) : (
              <span>{m.text}</span>
            )}
          </div>
        ))}
      </div>

      <div className="composer">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="question"
            placeholder="Ask your question…"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <button type="submit" disabled={!question.trim() || sending}>
            {sending ? "Sending…" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
