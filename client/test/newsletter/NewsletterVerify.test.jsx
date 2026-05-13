import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import NewsletterVerify from '../../src/Pages/NewsletterVerify/NewsletterVerify';
import { verifyNewsletter } from '../../src/services/newsletterService';

vi.mock('../../src/services/newsletterService', async () => {
  const actual = await vi.importActual('../../src/services/newsletterService');

  return {
    ...actual,
    verifyNewsletter: vi.fn(),
  };
});

const renderAt = (path) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <NewsletterVerify />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('NewsletterVerify page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const findHeadline = (text) => screen.findByText(text, { selector: '.newsletter-verify__headline' });

  it('shows the invalid state when no token is in the URL', async () => {
    renderAt('/newsletter/verify');

    expect(await findHeadline('Verification link is invalid.')).toBeInTheDocument();
    expect(verifyNewsletter).not.toHaveBeenCalled();
  });

  it('shows the success state when the API returns verified', async () => {
    verifyNewsletter.mockResolvedValueOnce({
      success: true,
      status: 'verified',
      message: "Thanks! Your subscription is confirmed.",
    });

    renderAt('/newsletter/verify?token=good-token');

    expect(await findHeadline("You're confirmed.")).toBeInTheDocument();
    expect(
      screen.getByText('Thanks! Your subscription is confirmed.')
    ).toBeInTheDocument();
    expect(verifyNewsletter).toHaveBeenCalledWith({ token: 'good-token' });
  });

  it('shows the expired state when the API returns expired', async () => {
    verifyNewsletter.mockResolvedValueOnce({
      success: false,
      status: 'expired',
      message: 'Verification link has expired. Please resubmit your email.',
    });

    renderAt('/newsletter/verify?token=expired-token');

    expect(await findHeadline('Verification link expired.')).toBeInTheDocument();
    expect(
      screen.getByText('Verification link has expired. Please resubmit your email.')
    ).toBeInTheDocument();
  });

  it('shows the invalid state when the API returns invalid', async () => {
    verifyNewsletter.mockResolvedValueOnce({
      success: false,
      status: 'invalid',
      message: 'Verification link is invalid or has already been used.',
    });

    renderAt('/newsletter/verify?token=bad-token');

    expect(await findHeadline('Verification link is invalid.')).toBeInTheDocument();
    expect(
      screen.getByText('Verification link is invalid or has already been used.')
    ).toBeInTheDocument();
  });

  it('shows the already_verified state when the API returns it', async () => {
    verifyNewsletter.mockResolvedValueOnce({
      success: true,
      status: 'already_verified',
      message: 'Your email is already confirmed.',
    });

    renderAt('/newsletter/verify?token=again-token');

    expect(await findHeadline('Already confirmed.')).toBeInTheDocument();
  });

  it('falls back to the invalid state if the service throws an unexpected error', async () => {
    verifyNewsletter.mockRejectedValueOnce(new Error('network down'));

    renderAt('/newsletter/verify?token=any');

    await waitFor(() => {
      expect(
        screen.getByText('Verification link is invalid.', {
          selector: '.newsletter-verify__headline',
        })
      ).toBeInTheDocument();
    });
  });
});
