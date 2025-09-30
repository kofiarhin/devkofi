import { forwardRef, useEffect } from "react";
import autoGrowTextarea from "../utils/autoGrowTextarea.js";
import styles from "./composer.styles.module.scss";

const Composer = forwardRef(
  ({ value, onChange, onSend, disabled, isSending }, ref) => {
    useEffect(() => {
      if (typeof ref === "object" && ref?.current) {
        autoGrowTextarea(ref.current);
      }
    }, [ref, value]);

    const handleChange = (event) => {
      onChange?.(event.target.value);
      autoGrowTextarea(event.target);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        onSend?.();
      }
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      onSend?.();
    };

    return (
      <form className={styles.composer} onSubmit={handleSubmit}>
        <textarea
          ref={ref}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Write a message"
          aria-label="Message composer"
          rows={1}
          maxLength={1000}
        />

        <button
          type="submit"
          className={styles.sendButton}
          aria-label="Send message"
          disabled={disabled}
        >
          {isSending ? "Sending" : "Send"}
        </button>
      </form>
    );
  }
);

export default Composer;
