import styles from "./suggestionChips.styles.module.scss";

const SuggestionChips = ({ chips = [], onInsert }) => {
  if (!chips.length) {
    return null;
  }

  return (
    <div className={styles.container} role="list">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          className={styles.chip}
          onClick={() => onInsert?.(chip)}
          aria-label={`Insert suggestion: ${chip}`}
        >
          {chip}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;
