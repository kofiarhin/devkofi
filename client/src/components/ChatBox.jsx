import "./ChatBox.styles.scss";
import { useEffect, useRef, useState, useCallback } from "react";
import useChatMutation from "../hooks/useChatMutation";

/**
 * Fixed composer version (WhatsApp-style)
 * - Composer is FIXED to the bottom, always fully visible (safe-area aware)
 * - Messages align to bottom and grow upward; scroll up to see older
 * - Auto-scroll only when user is at bottom
 * - VisualViewport integration to lift the composer with the mobile keyboard
 */
const ChatBox = ({ initialMessages = [], hasMore = false, onLoadOlder = null }) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [sending, setSending] = useState(false);

  // layout + scroll refs
  const boxRef = useRef(null);        // #chat-box root (for CSS vars)
  const listRef = useRef(null);       // scrollable messages container
  const topRef = useRef(null);        // top sentinel (optional: load older)
  const bottomRef = useRef(null);     // bottom sentinel (to detect at-bottom)
  const composerRef = useRef(null);   // fixed composer

  // scroll state
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [didInitScroll, setDidInitScroll] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(hasMore);

  const { mutate } = useChatMutation();

  // ----- Helpers -----
  const scrollToBottom = useCallback((behavior = "smooth") => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  // Keep --composer-h in sync with actual fixed composer height
  useEffect(() => {
    if (!composerRef.current || !boxRef.current) return;

    const applyHeights = () => {
      const h = Math.ceil(composerRef.current.getBoundingClientRect().height);
      boxRef.current.style.setProperty("--composer-h", `${h}px`);
    };

    applyHeights();
    const ro = new ResizeObserver(applyHeights);
    ro.observe(composerRef.current);
    window.addEventListener("resize", applyHeights);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", applyHeights);
    };
  }, []);

  // VisualViewport: lift fixed composer with mobile keyboard so it’s never clipped
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv || !composerRef.current || !boxRef.current) return;

    const handleVV = () => {
      // Amount of visual area covered at the bottom (keyboard/browser UI)
      const offset = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
      composerRef.current.style.transform = offset ? `translateY(-${offset}px)` : "translateY(0)";
      boxRef.current.style.setProperty("--vv-offset", `${offset}px`);
    };

    handleVV();
    vv.addEventListener("resize", handleVV);
    vv.addEventListener("scroll", handleVV);
    window.addEventListener("orientationchange", handleVV);

    return () => {
      vv.removeEventListener("resize", handleVV);
      vv.removeEventListener("scroll", handleVV);
      window.removeEventListener("orientationchange", handleVV);
    };
  }, []);

  // Track "at bottom" via IntersectionObserver on the bottom sentinel
  useEffect(() => {
    if (!bottomRef.current || !listRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setIsAtBottom(entry.isIntersecting),
      { root: listRef.current, threshold: 1.0 }
    );
    io.observe(bottomRef.current);
    return () => io.disconnect();
  }, []);

  // Initial scroll after first paint: land at bottom
  useEffect(() => {
    if (didInitScroll) return;
    const id = requestAnimationFrame(() => {
      scrollToBottom("auto");
      setDidInitScroll(true);
    });
    return () => cancelAnimationFrame(id);
  }, [didInitScroll, scrollToBottom]);

  // Auto-scroll on new messages only if user is at bottom
  useEffect(() => {
    if (!didInitScroll) return;
    if (isAtBottom) {
      const id = requestAnimationFrame(() => scrollToBottom("smooth"));
      return () => cancelAnimationFrame(id);
    }
  }, [messages, isAtBottom, didInitScroll, scrollToBottom]);

  // Optional: load older when top sentinel appears
  useEffect(() => {
    if (!topRef.current || !listRef.current) return;
    if (!onLoadOlder || !canLoadMore) return;

    const root = listRef.current;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || loadingOlder) return;
        setLoadingOlder(true);

        const prevScrollHeight = root.scrollHeight;
        const oldest = messages[0];

        try {
          const older = await onLoadOlder(oldest);
          if (Array.isArray(older) && older.length) {
            setMessages((prev) => [...older, ...prev]);
            requestAnimationFrame(() => {
              const delta = root.scrollHeight - prevScrollHeight;
              root.scrollTop = root.scrollTop + delta; // keep viewport stable
            });
          } else {
            setCanLoadMore(false);
          }
        } catch {
          // ignore fetch error
        } finally {
          setLoadingOlder(false);
        }
      },
      { root, threshold: 1.0 }
    );

    io.observe(topRef.current);
    return () => io.disconnect();
  }, [onLoadOlder, canLoadMore, loadingOlder, messages]);

  // ----- Messaging -----
  const createMessage = (role, content) => ({
    role,
    content,
    id: Date.now() + Math.random(),
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
      { text, history: messages },
      {
        onSuccess: (data) => {
          setMessages((prev) => [...prev, createMessage("assistant", data.answer)]);
        },
        onError: () => {
          setMessages((prev) => [...prev, createMessage("system", "Something went wrong. Try again.")]);
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
        {/* Top sentinel for upward pagination */}
        <div ref={topRef} />

        {messages.length === 0 && (
          <div className="empty-state">
            <h2 className="empty-text">What can i help you with?...</h2>
          </div>
        )}

        {/* Align to bottom so newest message hugs the composer */}
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
                {m.role === "assistant" && <span className="time">{m.time}</span>}
              </div>
              {m.role !== "assistant" && <span className="time">{m.time}</span>}
            </div>
          ))}

          {/* Bottom sentinel (detect at-bottom & scroll target) */}
          <div ref={bottomRef} />
        </div>

        {/* New messages chip (visible only when scrolled up) */}
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

        {/* Optional loader shown near the top when fetching older */}
        {loadingOlder && (
          <div className="top-loader" aria-live="polite">
            Loading earlier messages…
          </div>
        )}
      </div>

      {/* FIXED composer dock (CSS handles fixed positioning; JS adjusts transform for keyboard) */}
      <div className="composer" ref={composerRef}>
        <form onSubmit={handleSubmit}>
          <textarea
            name="question"
            placeholder="Ask your question…"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            // iOS: prevent zoom on focus with small fonts
            style={{ fontSize: 16 }}
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