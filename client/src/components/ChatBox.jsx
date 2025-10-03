// ChatBox.jsx
import "./ChatBox.styles.scss";
import { useEffect, useRef, useState, Fragment } from "react";
import useChatMutation from "../hooks/useChatMutation";

// Prism Light
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";

SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("ts", typescript);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("xml", markup);
SyntaxHighlighter.registerLanguage("html", markup);

/* ========= tolerant fenced-code parser ========= */
const normalizeLang = (raw = "") => {
  const lang = raw.trim().toLowerCase();
  const map = {
    js: "javascript",
    mjs: "javascript",
    cjs: "javascript",
    jsx: "jsx",
    ts: "typescript",
    tsx: "tsx",
    html: "html",
    xml: "xml",
    yml: "yaml",
    md: "markdown",
    sh: "bash",
    shell: "bash",
    py: "python",
    "c#": "cs",
    csharp: "cs",
  };
  return map[lang] || lang || "plaintext";
};

const tokenizeBlocks = (text = "") => {
  const re = /```[ \t]*([A-Za-z0-9+#.\-_]*)[ \t]*\r?\n?([\s\S]*?)(?:```|$)/g;
  const tokens = [];
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) tokens.push({ type: "text", content: text.slice(last, m.index) });
    tokens.push({ type: "code", lang: normalizeLang(m[1]), content: (m[2] || "").trim() });
    last = re.lastIndex;
  }
  if (last < text.length) tokens.push({ type: "text", content: text.slice(last) });
  return tokens;
};
/* ============================================== */

const linkifyAndBreak = (s = "") => {
  const urlRe = /(https?:\/\/[^\s]+)/g;
  const parts = s.split(urlRe);
  const nodes = [];
  parts.forEach((part, i) => {
    const isUrl = /^https?:\/\//.test(part);
    const chunks = isUrl
      ? [part]
      : part.split("\n").flatMap((line, j, arr) => (j < arr.length - 1 ? [line, "\n"] : [line]));
    chunks.forEach((ck, k) => {
      if (ck === "\n") nodes.push(<br key={`br-${i}-${k}`} />);
      else if (isUrl)
        nodes.push(
          <a key={`a-${i}-${k}`} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      else nodes.push(<Fragment key={`t-${i}-${k}`}>{ck}</Fragment>);
    });
  });
  return nodes;
};

const STARTERS = [
  "Generate a MERN boilerplate with auth",
  "Explain git rebase vs merge with examples",
  "Build an Express route with JWT guard",
  "Design a MongoDB aggregation for analytics",
];

const TypingDots = () => (
  <span className="typing" aria-label="Assistant is typing">
    <i /><i /><i />
  </span>
);

const ChatBox = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [copiedMap, setCopiedMap] = useState({});

  const chatRef = useRef(null);
  const bottomRef = useRef(null);
  const composerRef = useRef(null);
  const textareaRef = useRef(null);

  const { mutate } = useChatMutation();

  useEffect(() => {
    if (!chatRef.current || !composerRef.current) return;
    const el = composerRef.current;
    const apply = () => {
      const h = el.getBoundingClientRect().height;
      chatRef.current.style.setProperty("--composer-h", `${Math.round(h)}px`);
    };
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    apply();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!chatRef.current || !window.visualViewport) return;
    const vv = window.visualViewport;
    const apply = () => {
      const overlap = Math.max(0, window.innerHeight - vv.height);
      chatRef.current.style.setProperty("--vv-offset", `${Math.round(overlap)}px`);
    };
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    apply();
    return () => {
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
    };
  }, []);

  useEffect(() => {
    if (!bottomRef.current) return;
    const id = requestAnimationFrame(() => {
      bottomRef.current.scrollIntoView({
        behavior: messages.length <= 2 ? "auto" : "smooth",
        block: "end",
        inline: "nearest",
      });
    });
    return () => cancelAnimationFrame(id);
  }, [messages, sending]);

  // autosize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(160, el.scrollHeight) + "px";
  }, [question]);

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
    setQuestion("");
    setMessages((prev) => [...prev, createMessage("user", text)]);
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

  const handleCopy = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMap((m) => ({ ...m, [key]: true }));
      setTimeout(() => {
        setCopiedMap((m) => {
          const next = { ...m };
          delete next[key];
          return next;
        });
      }, 1200);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopiedMap((m) => ({ ...m, [key]: true }));
        setTimeout(() => {
          setCopiedMap((m) => {
            const next = { ...m };
            delete next[key];
            return next;
          });
        }, 1200);
      } finally {
        document.body.removeChild(ta);
      }
    }
  };

  return (
    <div id="chat-box" ref={chatRef}>
      <div className="messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <h2 className="empty-text">What can I help you with?</h2>
            <div className="starter-list" role="list">
              {STARTERS.map((s) => (
                <button key={s} type="button" className="starter-pill" onClick={() => setQuestion(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="messages-inner" aria-live="polite">
          {messages.map((m) => {
            const parts = tokenizeBlocks(m.content);
            return (
              <div key={m.id} className={`message ${m.role}`}>
                <div className="bubble">
                  {m.role === "assistant"
                    ? parts.map((t, idx) =>
                        t.type === "code" ? (
                          <div className="code-wrap" key={`code-${m.id}-${idx}`}>
                            <div className="code-bar">
                              <span className="lang-pill">{t.lang}</span>
                              <button
                                type="button"
                                className={`copy-btn ${copiedMap[`${m.id}-${idx}`] ? "copied" : ""}`}
                                aria-label={copiedMap[`${m.id}-${idx}`] ? "Copied" : "Copy code"}
                                title={copiedMap[`${m.id}-${idx}`] ? "Copied" : "Copy"}
                                onClick={() => handleCopy(`${m.id}-${idx}`, t.content)}
                              >
                                {copiedMap[`${m.id}-${idx}`] ? (
                                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                                  </svg>
                                ) : (
                                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                      fill="currentColor"
                                      d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"
                                    />
                                  </svg>
                                )}
                              </button>
                            </div>

                            <SyntaxHighlighter
                              language={t.lang}
                              style={oneDark}
                              customStyle={{
                                borderRadius: 10,
                                padding: "12px 14px",
                                margin: 0,
                                fontSize: "0.9rem",
                                overflow: "auto",
                                maxHeight: 420,
                              }}
                              PreTag="div"
                            >
                              {t.content}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <span key={`text-${m.id}-${idx}`} className="text">
                            {linkifyAndBreak(t.content)}
                          </span>
                        )
                      )
                    : (
                      <span className="text">{m.content}</span>
                    )}
                </div>

                <div className={`time-row ${m.role}`}>{m.time}</div>
              </div>
            );
          })}

          {sending && (
            <div className="message assistant">
              <div className="bubble">
                <TypingDots />
              </div>
              <div className="time-row assistant">…</div>
            </div>
          )}

          <div ref={bottomRef} style={{ scrollMarginBottom: "var(--composer-h)" }} />
        </div>
      </div>

      <div className="composer" ref={composerRef}>
        <form onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            name="question"
            placeholder="Ask your question."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            rows={1}
          />
          <button
            type="submit"
            className={`send-btn ${sending ? "is-sending" : ""}`}
            disabled={!question.trim() || sending}
            title="Send (Enter)"
            aria-label="Send"
          >
            {sending ? <span className="spinner" aria-hidden="true" /> : (
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;