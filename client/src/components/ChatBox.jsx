import "./ChatBox.styles.scss";
import { useEffect, useRef, useState } from "react";
import useChatMutation from "../hooks/useChatMutation";

const ChatBox = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  const listRef = useRef(null);
  const bottomRef = useRef(null); // NEW

  const { mutate } = useChatMutation();

  // Auto-scroll to newest message
  useEffect(() => {
    if (!bottomRef.current) return;
    // wait for DOM paint, then scroll
    const id = requestAnimationFrame(() => {
      bottomRef.current.scrollIntoView({
        behavior: messages.length <= 2 ? "auto" : "smooth",
        block: "end",
      });
    });
    return () => cancelAnimationFrame(id);
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = question.trim();
    if (!text || sending) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, id: Date.now() + Math.random() },
    ]);
    setQuestion("");
    setSending(true);

    mutate(
      { text, history: messages },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.answer,
              id: Date.now() + Math.random(),
            },
          ]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              role: "system",
              content: "Something went wrong. Try again.",
              id: Date.now() + Math.random(),
            },
          ]);
        },
        onSettled: () => setSending(false),
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
  };

  return (
    <div id="chat-box">
      <div className="messages" ref={listRef}>
        <div className="messages-inner">
          {messages.map((m) => (
            <div key={m.id} className={`message ${m.role}`}>
              <div className="bubble">
                <span className="text">{m.content}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} /> {/* ANCHOR */}
        </div>
      </div>

      <div className="composer">
        <form onSubmit={handleSubmit}>
          <textarea
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
