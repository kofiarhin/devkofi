import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Newsletter from '../../src/components/Newsletter/Newsletter';
import { subscribeToNewsletter } from '../../src/services/newsletterService';

vi.mock('../../src/services/newsletterService', async () => {
  const actual = await vi.importActual('../../src/services/newsletterService');

  return {
    ...actual,
    subscribeToNewsletter: vi.fn(),
  };
});

const renderNewsletter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <Newsletter />
    </QueryClientProvider>
  );
};

const createDeferred = () => {
  let resolve;

  const promise = new Promise((promiseResolve) => {
    resolve = promiseResolve;
  });

  return { promise, resolve };
};

describe('Newsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the redesigned newsletter content', () => {
    renderNewsletter();

    expect(screen.getByText(/dev signal/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /keep your build moving/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/mern tactics, ai workflow notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join/i })).toBeInTheDocument();
  });

  it('shows required validation when submitted empty', async () => {
    const user = userEvent.setup();
    renderNewsletter();

    await user.click(screen.getByRole('button', { name: /^join$/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Email address is required.');
    expect(subscribeToNewsletter).not.toHaveBeenCalled();
  });

  it('shows format validation for invalid emails', async () => {
    const user = userEvent.setup();
    renderNewsletter();

    await user.type(screen.getByLabelText(/email address/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /^join$/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address.');
    expect(subscribeToNewsletter).not.toHaveBeenCalled();
  });

  it('shows a loading state while submitting', async () => {
    const user = userEvent.setup();
    const deferred = createDeferred();
    subscribeToNewsletter.mockReturnValueOnce(deferred.promise);

    renderNewsletter();

    await user.type(screen.getByLabelText(/email address/i), 'builder@test.com');
    await user.click(screen.getByRole('button', { name: /^join$/i }));

    expect(screen.getByRole('button', { name: /joining/i })).toBeDisabled();

    deferred.resolve({
      success: true,
      pendingVerification: true,
      message: 'Check your email to confirm your subscription.',
    });

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Check your email to confirm your subscription.'
      );
    });
  });

  it('shows the check-your-email message after a valid submission', async () => {
    const user = userEvent.setup();
    subscribeToNewsletter.mockResolvedValueOnce({
      success: true,
      pendingVerification: true,
      message: 'Check your email to confirm your subscription.',
    });

    renderNewsletter();

    await user.type(screen.getByLabelText(/email address/i), 'builder@test.com');
    await user.click(screen.getByRole('button', { name: /^join$/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Check your email to confirm your subscription.'
      );
    });
  });

  it('falls back to the default verification copy when the server omits a message', async () => {
    const user = userEvent.setup();
    subscribeToNewsletter.mockResolvedValueOnce({ success: true });

    renderNewsletter();

    await user.type(screen.getByLabelText(/email address/i), 'builder@test.com');
    await user.click(screen.getByRole('button', { name: /^join$/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Check your email to confirm your subscription.'
      );
    });
  });

  it('shows the API error message when subscription fails', async () => {
    const user = userEvent.setup();
    subscribeToNewsletter.mockRejectedValueOnce({
      response: { data: { error: 'Too many requests. Try again later.' } },
    });

    renderNewsletter();

    await user.type(screen.getByLabelText(/email address/i), 'builder@test.com');
    await user.click(screen.getByRole('button', { name: /^join$/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Too many requests. Try again later.');
    });
  });
});
