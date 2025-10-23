export const submitFeedback = async (payload) => {
  const response = await fetch('/api/ux/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Unable to submit feedback');
  }

  return response.json();
};
