import "./ChatBox.styles.scss";
import { useEffect, useRef, useState } from "react";
import useChatMutation from "../hooks/useChatMutation";

const ChatBox = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  const listRef = useRef(null);
  const bottomRef = useRef(null);

  const { mutate } = useChatMutation();

  // Auto-scroll to newest message
  useEffect(() => {
    if (!bottomRef.current) return;
    const id = requestAnimationFrame(() => {
      bottomRef.current.scrollIntoView({
        behavior: messages.length <= 2 ? "auto" : "smooth",
        block: "end",
      });
    });
    return () => cancelAnimationFrame(id);
  }, [messages]);

  const createMessage = (role, content) => ({
    role,
    content,
    id: Date.now() + Math.random(),
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = question.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, createMessage("user", text)]);
    setQuestion("");
    setSending(true);

    mutate(
      { text, history: messages },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            createMessage("assistant", data.answer),
          ]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            createMessage("system", "Something went wrong. Try again."),
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
        {messages.length === 0 && (
          <div className="empty-state">
            <h2 className="empty-text">What can i help you with?...</h2>
          </div>
        )}

        <div className="messages-inner">
          {messages.map((m) => (
            <div key={m.id} className={`message ${m.role}`}>
              <div className="bubble">
                <span className="text">{m.content}</span>
                {m.role === "assistant" && (
                  <span className="time">{m.time}</span>
                )}
              </div>
              {m.role !== "assistant" && <span className="time">{m.time}</span>}
            </div>
          ))}
          <div ref={bottomRef} />
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
