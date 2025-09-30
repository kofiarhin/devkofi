const clampHeight = (node, maxHeight) => {
  if (!node) {
    return;
  }

  const nextHeight = Math.min(node.scrollHeight, maxHeight);
  node.style.height = `${nextHeight}px`;
  node.style.overflowY = node.scrollHeight > maxHeight ? "auto" : "hidden";
};

const autoGrowTextarea = (node, { maxRows = 5 } = {}) => {
  if (!node) {
    return;
  }

  const computed = window.getComputedStyle(node);
  const lineHeight = parseFloat(computed.lineHeight || "0") || 20;
  const minHeight = parseFloat(computed.minHeight || "0") || 0;
  const maxHeight = lineHeight * maxRows;

  node.style.height = "auto";
  clampHeight(node, maxHeight);

  if (minHeight && parseFloat(node.style.height || "0") < minHeight) {
    node.style.height = `${minHeight}px`;
  }
};

export default autoGrowTextarea;
