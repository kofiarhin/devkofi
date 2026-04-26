import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminDashboard from './AdminDashboard';
import {
  exportNewsletterSubscribersCsv,
  exportNewsletterSubscribersJson,
} from '../../services/adminService';
import downloadFile from '../../utils/downloadFile';

vi.mock('react-redux', () => ({
  useSelector: (selector) => selector({ auth: { admin: { email: 'admin@devkofi.com' } } }),
}));

vi.mock('../../hooks/mutations/useLogoutAdmin', () => ({
  default: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('../../hooks/queries/useContactMessages', () => ({
  default: () => ({
    isLoading: false,
    data: {
      data: {
        data: {
          messages: [],
          page: 1,
          total: 0,
          limit: 20,
        },
      },
    },
  }),
}));

vi.mock('../../hooks/queries/useNewsletterSubscribers', () => ({
  default: () => ({
    isLoading: false,
    data: {
      data: {
        data: {
          subscribers: [{ _id: '1', email: 'one@test.com', createdAt: '2026-04-22T10:30:00.000Z' }],
          page: 1,
          total: 1,
          limit: 20,
        },
      },
    },
  }),
}));

vi.mock('../../hooks/queries/useAdminBookings', () => ({
  default: () => ({
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
    data: {
      data: {
        data: {
          bookings: [],
          page: 1,
          total: 0,
          limit: 20,
        },
      },
    },
  }),
}));

vi.mock('../../hooks/queries/useAdminBooking', () => ({
  default: () => ({
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
    data: null,
  }),
}));

vi.mock('../../hooks/mutations/useUpdateBooking', () => ({
  default: () => ({ mutateAsync: vi.fn(), isPending: false, error: null }),
}));

vi.mock('../../hooks/mutations/useCancelBooking', () => ({
  default: () => ({ mutateAsync: vi.fn(), isPending: false, error: null }),
}));

vi.mock('../../hooks/mutations/useDeleteBooking', () => ({
  default: () => ({ mutateAsync: vi.fn(), isPending: false, error: null }),
}));

vi.mock('../../services/adminService', () => ({
  exportNewsletterSubscribersCsv: vi.fn(),
  exportNewsletterSubscribersJson: vi.fn(),
}));

vi.mock('../../utils/downloadFile', () => ({
  default: vi.fn(),
  getFilenameFromDisposition: vi.fn(() => 'newsletter-subscribers-2026-04-22.csv'),
}));

const renderComponent = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AdminDashboard />
    </QueryClientProvider>
  );
};

describe('AdminDashboard newsletter export', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('triggers CSV download', async () => {
    exportNewsletterSubscribersCsv.mockResolvedValue({
      data: new Blob(['email,subscribedAt\n']),
      headers: { 'content-disposition': 'attachment; filename="newsletter-subscribers-2026-04-22.csv"' },
    });

    renderComponent();
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Newsletter Subscribers' }));
    await user.click(screen.getByRole('button', { name: 'Export' }));
    await user.click(screen.getByRole('menuitem', { name: 'Export CSV' }));

    await waitFor(() => {
      expect(exportNewsletterSubscribersCsv).toHaveBeenCalledTimes(1);
      expect(downloadFile).toHaveBeenCalledTimes(1);
    });
  });

  it('triggers JSON download', async () => {
    exportNewsletterSubscribersJson.mockResolvedValue({
      data: new Blob(['[]']),
      headers: { 'content-disposition': 'attachment; filename="newsletter-subscribers-2026-04-22.json"' },
    });

    renderComponent();
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Newsletter Subscribers' }));
    await user.click(screen.getByRole('button', { name: 'Export' }));
    await user.click(screen.getByRole('menuitem', { name: 'Export JSON' }));

    await waitFor(() => {
      expect(exportNewsletterSubscribersJson).toHaveBeenCalledTimes(1);
      expect(downloadFile).toHaveBeenCalledTimes(1);
    });
  });

  it('shows error state when export fails', async () => {
    exportNewsletterSubscribersCsv.mockRejectedValue(new Error('boom'));

    renderComponent();
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Newsletter Subscribers' }));
    await user.click(screen.getByRole('button', { name: 'Export' }));
    await user.click(screen.getByRole('menuitem', { name: 'Export CSV' }));

    expect(await screen.findByText('Export failed. Please try again.')).toBeTruthy();
  });

  it('shows loading label while exporting', async () => {
    let resolveRequest;
    const pendingPromise = new Promise((resolve) => {
      resolveRequest = resolve;
    });

    exportNewsletterSubscribersCsv.mockReturnValue(pendingPromise);

    renderComponent();
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Newsletter Subscribers' }));
    await user.click(screen.getByRole('button', { name: 'Export' }));
    await user.click(screen.getByRole('menuitem', { name: 'Export CSV' }));

    expect(screen.getByRole('button', { name: 'Exporting...' }).disabled).toBe(true);

    resolveRequest({
      data: new Blob(['email,subscribedAt\n']),
      headers: { 'content-disposition': 'attachment; filename="newsletter-subscribers-2026-04-22.csv"' },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Export' })).toBeTruthy();
    });
  });
});
