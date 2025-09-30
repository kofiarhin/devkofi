import { forwardRef } from "react";
import styles from "./messageList.styles.module.scss";

const MessageList = forwardRef(
  (
    { messages, isLoading, isFetching, className, ...rest },
    ref
  ) => {
    const showInitialLoading = isLoading && !messages.length;

    return (
      <section
        {...rest}
        ref={ref}
        data-testid="message-list"
        className={[styles.messageList, className].filter(Boolean).join(" ")}
        role="log"
        aria-live="polite"
      >
        {showInitialLoading ? (
          <p className={styles.meta}>Loading messages…</p>
        ) : (
          messages.map((message) => (
            <article
              key={message.id}
              className={[styles.message, styles[message.role]]
                .filter(Boolean)
                .join(" ")}
              data-role={message.role}
            >
              <p>{message.text}</p>
            </article>
          ))
        )}

        {isFetching && !isLoading ? (
          <p className={styles.meta}>Refreshing…</p>
        ) : null}
      </section>
    );
  }
);

export default MessageList;
