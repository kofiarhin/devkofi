import styles from "./jumpToBottomFAB.styles.module.scss";

const JumpToBottomFAB = ({ visible, onClick }) => {
  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      className={styles.fab}
      onClick={onClick}
      aria-label="Jump to latest"
    >
      ↓
    </button>
  );
};

export default JumpToBottomFAB;
