import "./ChatBox.styles.scss";
import { useEffect, useRef, useState } from "react";
import useChatMutation from "../hooks/useChatMutation";

const ChatBox = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  // scroll + layout refs
  const boxRef = useRef(null);          // #chat-box root
  const listRef = useRef(null);         // scrollable messages container
  const bottomRef = useRef(null);       // bottom sentinel
  const composerRef = useRef(null);     // sticky composer

  // scroll state
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [didInitScroll, setDidInitScroll] = useState(false);

  const { mutate } = useChatMutation();

  // --- Helpers ---
  const scrollToBottom = (behavior = "smooth") => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  };

  // Track whether user is at the bottom via IntersectionObserver on sentinel
  useEffect(() => {
    if (!bottomRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setIsAtBottom(entry.isIntersecting),
      { root: listRef.current, threshold: 1.0 }
    );
    io.observe(bottomRef.current);
    return () => io.disconnect();
  }, []);

  // Initial scroll after first paint
  useEffect(() => {
    if (didInitScroll) return;
    const id = requestAnimationFrame(() => {
      scrollToBottom("auto");
      setDidInitScroll(true);
    });
    return () => cancelAnimationFrame(id);
  }, [didInitScroll]);

  // Auto-scroll on new messages only if user is at bottom
  useEffect(() => {
    if (!didInitScroll) return;
    if (isAtBottom) {
      // next frame to ensure DOM height updated
      const id = requestAnimationFrame(() => scrollToBottom("smooth"));
      return () => cancelAnimationFrame(id);
    }
  }, [messages, isAtBottom, didInitScroll]);

  // Keep --composer-h CSS var in sync with actual composer height
  useEffect(() => {
    if (!composerRef.current || !boxRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.contentRect.height;
        boxRef.current.style.setProperty("--composer-h", `${Math.ceil(h)}px`);
      }
    });
    ro.observe(composerRef.current);
    // set initial value
    boxRef.current.style.setProperty(
      "--composer-h",
      `${Math.ceil(composerRef.current.getBoundingClientRect().height)}px`
    );
    return () => ro.disconnect();
  }, []);

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

    const userMsg = createMessage("user", text);
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setSending(true);

    mutate(
      { text, history: messages }, // using current history; OK for this flow
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
    <div id="chat-box" ref={boxRef}>
      <div className="messages" ref={listRef}>
        {messages.length === 0 && (
          <div className="empty-state">
            <h2 className="empty-text">What can i help you with?...</h2>
          </div>
        )}

        <div
          className="messages-inner"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
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
          {/* Bottom sentinel (used for at-bottom detection and scroll target) */}
          <div ref={bottomRef} />
        </div>

        {/* New messages toast when user is scrolled up */}
        {!isAtBottom && messages.length > 0 && (
          <button
            className="new-toast"
            type="button"
            onClick={() => scrollToBottom("smooth")}
            aria-label="Scroll to latest messages"
          >
            New messages ↓
          </button>
        )}
      </div>

      <div className="composer" ref={composerRef}>
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

