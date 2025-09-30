import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages, normalizeMessages, postMessage } from "../services/chatAdapter.js";
import MessageList from "./MessageList.jsx";
import SuggestionChips from "./SuggestionChips.jsx";
import Composer from "./Composer.jsx";
import JumpToBottomFAB from "./JumpToBottomFAB.jsx";
import styles from "./chatBox.styles.module.scss";

const themeTokens = {
  "--bg": "#0B0B0C",
  "--surface": "#111215",
  "--text": "#F4F5F7",
  "--muted": "#A8ADB3",
  "--accent": "#4CAF50",
  "--border": "#1B1C20",
  "--radius": "14px",
};

const retryDelay = (attempt) => Math.min(1000 * 2 ** attempt, 4000);

const ChatBox = ({ chatId = "default", chips = [], className }) => {
  const queryClient = useQueryClient();
  const listRef = useRef(null);
  const textareaRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);
  const pendingTimerRef = useRef();

  const queryKey = useMemo(() => ["chat", chatId], [chatId]);

  const scrollToLatest = useCallback(() => {
    const node = listRef.current;

    if (!node) {
      return;
    }

    const top = node.scrollHeight;

    if (typeof node.scrollTo === "function") {
      node.scrollTo({ top });
    } else {
      node.scrollTop = top;
    }
  }, []);

  const handleScroll = useCallback(() => {
    const node = listRef.current;

    if (!node) {
      return;
    }

    const distanceFromBottom =
      node.scrollHeight - node.scrollTop - node.clientHeight;

    setIsAtBottom(distanceFromBottom <= 24);
  }, []);

  useEffect(() => {
    const node = listRef.current;

    if (!node) {
      return;
    }

    handleScroll();
    node.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      node.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const { data: messages = [], isFetching, isLoading } = useQuery({
    queryKey,
    queryFn: () => getMessages(chatId),
    select: normalizeMessages,
    enabled: Boolean(chatId),
    retry: 2,
    retryDelay,
  });

  useEffect(() => {
    if (isAtBottom) {
      scrollToLatest();
    }
  }, [messages, isAtBottom, scrollToLatest]);

  useEffect(() => () => window.clearTimeout(pendingTimerRef.current), []);

  const mutation = useMutation({
    mutationFn: ({ text, tempId }) => postMessage({ chatId, text, tempId }),
    retry: 2,
    retryDelay,
    onMutate: async ({ text, tempId, timestamp }) => {
      await queryClient.cancelQueries({ queryKey });
      window.clearTimeout(pendingTimerRef.current);
      const previousMessages =
        queryClient.getQueryData(queryKey) || [];

      const optimisticMessage = {
        id: tempId,
        role: "user",
        text,
        createdAt: timestamp,
      };

      setStatus("Sending…");
      setIsAtBottom(true);
      queryClient.setQueryData(queryKey, (current = []) =>
        normalizeMessages([...current, optimisticMessage])
      );

      return { previousMessages, tempId };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(queryKey, context.previousMessages);
      }

      setStatus("Failed");
    },
    onSuccess: ({ messages: nextMessages, replacements }) => {
      queryClient.setQueryData(queryKey, (current = []) => {
        let updated = current;

        if (Array.isArray(replacements) && replacements.length) {
          updated = current.map((message) => {
            const replacement = replacements.find(
              (entry) => entry.tempId === message.id
            );

            if (!replacement) {
              return message;
            }

            const replacementMessage = nextMessages.find(
              (item) => item.id === replacement.id
            );

            return replacementMessage || message;
          });
        }

        const appended = nextMessages.filter((message) => {
          if (!Array.isArray(replacements)) {
            return true;
          }

          return !replacements.some((entry) => entry.id === message.id);
        });

        return normalizeMessages([...updated, ...appended]);
      });

      setStatus("Delivered");
      pendingTimerRef.current = window.setTimeout(() => {
        setStatus("");
      }, 2000);
      scrollToLatest();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();

    if (!trimmed || !chatId) {
      return;
    }

    const tempId = `tmp-${Date.now()}`;
    const timestamp = Date.now();

    mutation.mutate({ text: trimmed, tempId, timestamp });
    setInputValue("");
    setIsAtBottom(true);
    textareaRef.current?.focus();
  }, [chatId, inputValue, mutation]);

  const handleChipInsert = useCallback((chip) => {
    setInputValue(chip);

    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => textareaRef.current?.focus());
      return;
    }

    textareaRef.current?.focus();
  }, []);

  const isComposerDisabled = mutation.isPending || !inputValue.trim();

  return (
    <div
      className={[styles.chatBox, className].filter(Boolean).join(" ")}
      style={themeTokens}
      data-testid="chat-box"
    >
      <MessageList
        ref={listRef}
        messages={messages}
        isLoading={isLoading}
        isFetching={isFetching}
        aria-label="Conversation"
      />

      <SuggestionChips chips={chips} onInsert={handleChipInsert} />

      <Composer
        ref={textareaRef}
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        disabled={isComposerDisabled}
        isSending={mutation.isPending}
      />

      <JumpToBottomFAB visible={!isAtBottom && messages.length > 0} onClick={scrollToLatest} />

      <div className={styles.statusRegion} role="status" aria-live="polite">
        {status}
      </div>
    </div>
  );
};

export default ChatBox;
