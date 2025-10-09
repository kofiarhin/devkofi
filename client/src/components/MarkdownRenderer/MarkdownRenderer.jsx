import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import copyToClipboard from "../../utils/copyToClipboard";
import styles from "./markdownRenderer.styles.module.scss";

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const result = await copyToClipboard(code);
      if (!result) {
        return;
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // No-op: clipboard failures are non-blocking for rendering.
    }
  };

  return (
    <div className={styles.codeBlock}>
      <button className={styles.copyButton} type="button" onClick={handleCopy}>
        {copied ? "Copied" : "Copy"}
      </button>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        PreTag="div"
        customStyle={{ margin: 0, background: "transparent" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const MarkdownRenderer = ({ content }) => {
  const markdown = useMemo(() => content ?? "", [content]);

  const InlineCode = ({ className, children }) => (
    <code className={className}>{children}</code>
  );

  const Pre = ({ children }) => {
    const child = Array.isArray(children) ? children[0] : children;
    const rawCode = child?.props?.children ?? "";
    const code = String(rawCode).replace(/\n$/, "");
    const languageMatch = /language-(\w+)/.exec(child?.props?.className ?? "");
    const language = languageMatch?.[1] ?? "text";

    return <CodeBlock code={code} language={language} />;
  };

  return (
    <div className={styles.prose}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ code: InlineCode, pre: Pre }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
