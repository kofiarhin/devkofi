import "./typeWriter.styles.scss";
import { useState, useEffect } from "react";

export default function Typewriter({
  title = "",
  subtitle = "",
  text = "",
  titleSpeed = 10,
  subtitleSpeed = 20,
  textSpeed = 10,
}) {
  const [titleText, setTitleText] = useState("");
  const [subtitleText, setSubtitleText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [bodyIndex, setBodyIndex] = useState(0);
  const [titleDone, setTitleDone] = useState(false);
  const [subtitleDone, setSubtitleDone] = useState(false);

  // Title typing
  useEffect(() => {
    if (titleIndex < title.length) {
      const timeout = setTimeout(() => {
        setTitleText((prev) => prev + title.charAt(titleIndex));
        setTitleIndex((prev) => prev + 1);
      }, titleSpeed);
      return () => clearTimeout(timeout);
    } else {
      setTitleDone(true);
    }
  }, [titleIndex, title, titleSpeed]);

  // Subtitle typing (after title is done)
  useEffect(() => {
    if (titleDone && subtitleIndex < subtitle.length) {
      const timeout = setTimeout(() => {
        setSubtitleText((prev) => prev + subtitle.charAt(subtitleIndex));
        setSubtitleIndex((prev) => prev + 1);
      }, subtitleSpeed);
      return () => clearTimeout(timeout);
    } else if (titleDone && subtitleIndex >= subtitle.length) {
      setSubtitleDone(true);
    }
  }, [titleDone, subtitleIndex, subtitle, subtitleSpeed]);

  // Body text typing (after subtitle is done)
  useEffect(() => {
    if (subtitleDone && bodyIndex < text.length) {
      const timeout = setTimeout(() => {
        setBodyText((prev) => prev + text.charAt(bodyIndex));
        setBodyIndex((prev) => prev + 1);
      }, textSpeed);
      return () => clearTimeout(timeout);
    }
  }, [subtitleDone, bodyIndex, text, textSpeed]);

  return (
    <div id="type-writer">
      {title && <h1>{titleText}</h1>}
      {subtitle && <h2>{subtitleText}</h2>}
      {text && <p>{bodyText}</p>}
    </div>
  );
}

/* Usage:
<Typewriter
  title="Welcome"
  subtitle="We build fast apps"
  text="This is a demo of a typewriter effect with title, subtitle, and text."
  titleSpeed={80}
  subtitleSpeed={60}
  textSpeed={40}
/>
*/
