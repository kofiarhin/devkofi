export const getFilenameFromDisposition = (contentDisposition, fallbackName) => {
  if (!contentDisposition) return fallbackName;

  const utfMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1]).replace(/['"]/g, '');
  }

  const match = contentDisposition.match(/filename\s*=\s*"?([^";]+)"?/i);
  return match?.[1] || fallbackName;
};

const downloadFile = ({ blob, filename }) => {
  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(objectUrl);
};

export default downloadFile;
