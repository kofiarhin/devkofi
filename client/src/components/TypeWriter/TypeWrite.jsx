import "./typeWriter.styles.scss";
import React, { useEffect, useRef, useState } from "react";

export default function Typewriter({
  text = "",
  speed = 40, // ms per char
  startDelay = 0, // ms before typing starts
  cursor = true, // show blinking caret
  onDone, // callback when finished
  className = "",
}) {
  const [out, setOut] = useState("");
  const iRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // reset on text change
    clearTimeout(timerRef.current);
    setOut("");
    iRef.current = 0;

    if (!text || typeof text !== "string") return; // guard non-string/empty

    const tick = () => {
      const i = iRef.current;
      if (i >= text.length) {
        if (onDone) onDone();
        return;
      }
      const ch = text.charAt(i); // always defined string
      setOut((prev) => prev + ch);
      iRef.current = i + 1;
      timerRef.current = setTimeout(tick, speed);
    };

    timerRef.current = setTimeout(tick, startDelay);
    return () => clearTimeout(timerRef.current);
  }, [text, speed, startDelay, onDone]);

  return (
    <div id="type-writer">
      <span className={className} style={{ whiteSpace: "pre-wrap" }}>
        {out}
        {cursor && <span className="tw-caret">|</span>}
      </span>
    </div>
  );
}

/* Optional CSS:
.tw-caret {
  display: inline-block;
  animation: twblink 1s step-end infinite;
}
@keyframes twblink { 50% { opacity: 0; } }
*/
