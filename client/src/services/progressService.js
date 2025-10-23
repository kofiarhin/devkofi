export const fetchProgress = async () => {
  const response = await fetch('/api/user/progress', {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Unable to load progress');
  }

  return response.json();
};

export const updateProgress = async (payload) => {
  const response = await fetch('/api/user/progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Unable to update progress');
  }

  return response.json();
};
