import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import authReducer from '../../src/redux/auth/authSlice';
import AdminDashboard from '../../src/Pages/AdminDashboard/AdminDashboard';

vi.mock('../../src/hooks/queries/useContactMessages');
vi.mock('../../src/hooks/queries/useNewsletterSubscribers');
vi.mock('../../src/hooks/queries/useAdminBookings');
vi.mock('../../src/hooks/queries/useAdminBooking');
vi.mock('../../src/hooks/mutations/useLogoutAdmin');
vi.mock('../../src/hooks/mutations/useUpdateBooking');
vi.mock('../../src/hooks/mutations/useCancelBooking');
vi.mock('../../src/hooks/mutations/useDeleteBooking');

import useContactMessages from '../../src/hooks/queries/useContactMessages';
import useNewsletterSubscribers from '../../src/hooks/queries/useNewsletterSubscribers';
import useAdminBookings from '../../src/hooks/queries/useAdminBookings';
import useAdminBooking from '../../src/hooks/queries/useAdminBooking';
import useLogoutAdmin from '../../src/hooks/mutations/useLogoutAdmin';
import useUpdateBooking from '../../src/hooks/mutations/useUpdateBooking';
import useCancelBooking from '../../src/hooks/mutations/useCancelBooking';
import useDeleteBooking from '../../src/hooks/mutations/useDeleteBooking';

const ADMIN = { email: 'admin@devkofi.com', role: 'admin' };

const makeStore = () =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { admin: ADMIN, isChecked: true } },
  });

const renderDashboard = () => {
  const store = makeStore();
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/messages/:messageId" element={<p>Message details route</p>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
};

const mockMessages = [
  { _id: '1', name: 'Alice', email: 'alice@test.com', subject: 'Hello', message: 'Hi there', createdAt: '2026-01-01' },
];

const mockSubscribers = [
  { _id: '1', email: 'sub@test.com', createdAt: '2026-01-01' },
];

const mockBookings = [
  {
    id: 'booking-1',
    name: 'Mara Linwood',
    email: 'mara@example.com',
    company: 'Stone Field',
    message: 'Need help with a portfolio build.',
    slotStart: '2099-02-02T16:00:00.000Z',
    slotEnd: '2099-02-02T16:30:00.000Z',
    status: 'booked',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 'booking-2',
    name: 'Owen Fletcher',
    email: 'owen@example.com',
    company: '',
    message: '',
    slotStart: '2099-02-03T16:30:00.000Z',
    slotEnd: '2099-02-03T17:00:00.000Z',
    status: 'cancelled',
    createdAt: '2026-01-02T10:00:00.000Z',
    updatedAt: '2026-01-02T10:00:00.000Z',
  },
];

const mockAdminBookingData = (overrides = {}) => ({
  data: {
    data: {
      data: {
        bookings: mockBookings,
        page: 1,
        limit: 20,
        total: mockBookings.length,
        ...overrides,
      },
    },
  },
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
});

const mockAdminBookingDetail = (booking = mockBookings[0]) => ({
  data: { data: { data: { booking } } },
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
});

beforeEach(() => {
  vi.clearAllMocks();
  useLogoutAdmin.mockReturnValue({ mutate: vi.fn(), isPending: false });
  useAdminBookings.mockReturnValue(mockAdminBookingData());
  useAdminBooking.mockReturnValue(mockAdminBookingDetail());
  useUpdateBooking.mockReturnValue({ mutateAsync: vi.fn().mockResolvedValue({}), isPending: false, error: null });
  useCancelBooking.mockReturnValue({ mutateAsync: vi.fn().mockResolvedValue({}), isPending: false, error: null });
  useDeleteBooking.mockReturnValue({ mutateAsync: vi.fn().mockResolvedValue({}), isPending: false, error: null });
});

describe('AdminDashboard Contact Messages tab', () => {
  it('renders messages from mock data', () => {
    useContactMessages.mockReturnValue({
      data: { data: { data: { messages: mockMessages, total: 1, limit: 20 } } },
      isLoading: false,
    });
    useNewsletterSubscribers.mockReturnValue({ data: null, isLoading: false });

    renderDashboard();
    fireEvent.click(screen.getByRole('tab', { name: /contact messages/i }));

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('alice@test.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view message from alice/i })).toBeInTheDocument();
  });

  it('navigates to details route when subject button is clicked', () => {
    useContactMessages.mockReturnValue({
      data: { data: { data: { messages: mockMessages, total: 1, limit: 20 } } },
      isLoading: false,
    });
    useNewsletterSubscribers.mockReturnValue({ data: null, isLoading: false });

    renderDashboard();
    fireEvent.click(screen.getByRole('tab', { name: /contact messages/i }));
    fireEvent.click(screen.getByRole('button', { name: /view message from alice/i }));

    expect(screen.getByText('Message details route')).toBeInTheDocument();
  });

  it('shows empty state when messages array is empty', () => {
    useContactMessages.mockReturnValue({
      data: { data: { data: { messages: [], total: 0, limit: 20 } } },
      isLoading: false,
    });
    useNewsletterSubscribers.mockReturnValue({ data: null, isLoading: false });

    renderDashboard();
    fireEvent.click(screen.getByRole('tab', { name: /contact messages/i }));

    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
  });
});

describe('AdminDashboard Newsletter Subscribers tab', () => {
  it('renders subscribers from mock data', () => {
    useContactMessages.mockReturnValue({
      data: { data: { data: { messages: [], total: 0, limit: 20 } } },
      isLoading: false,
    });
    useNewsletterSubscribers.mockReturnValue({
      data: { data: { data: { subscribers: mockSubscribers, total: 1, limit: 20 } } },
      isLoading: false,
    });

    renderDashboard();
    fireEvent.click(screen.getByRole('tab', { name: /newsletter subscribers/i }));

    expect(screen.getByText('sub@test.com')).toBeInTheDocument();
  });

  it('shows empty state when subscribers array is empty', () => {
    useContactMessages.mockReturnValue({
      data: { data: { data: { messages: [], total: 0, limit: 20 } } },
      isLoading: false,
    });
    useNewsletterSubscribers.mockReturnValue({
      data: { data: { data: { subscribers: [], total: 0, limit: 20 } } },
      isLoading: false,
    });

    renderDashboard();
    fireEvent.click(screen.getByRole('tab', { name: /newsletter subscribers/i }));

    expect(screen.getByText(/no subscribers yet/i)).toBeInTheDocument();
  });
});

describe('AdminDashboard Bookings tab', () => {
  it('renders booking rows by default', () => {
    useContactMessages.mockReturnValue({
      data: { data: { data: { messages: [], total: 0, limit: 20 } } },
      isLoading: false,
    });
    useNewsletterSubscribers.mockReturnValue({ data: null, isLoading: false });

    renderDashboard();

    expect(screen.getByRole('tab', { name: /bookings/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Mara Linwood')).toBeInTheDocument();
    expect(screen.getByText('mara@example.com')).toBeInTheDocument();
    expect(screen.getByText('Stone Field')).toBeInTheDocument();
  });

  it('shows loading and empty states', () => {
    useContactMessages.mockReturnValue({
      data: { data: { data: { messages: [], total: 0, limit: 20 } } },
      isLoading: false,
    });
    useNewsletterSubscribers.mockReturnValue({ data: null, isLoading: false });
    useAdminBookings.mockReturnValue({ data: null, isLoading: true, isError: false, refetch: vi.fn() });

    const { unmount } = renderDashboard();
    expect(screen.getByRole('table')).toBeInTheDocument();

    unmount();
    useAdminBookings.mockReturnValue(mockAdminBookingData({ bookings: [], total: 0 }));
    renderDashboard();

    expect(screen.getByText(/no bookings found/i)).toBeInTheDocument();
  });

  it('shows error state with retry action', () => {
    const refetch = vi.fn();
    useContactMessages.mockReturnValue({
      data: { data: { data: { messages: [], total: 0, limit: 20 } } },
      isLoading: false,
    });
    useNewsletterSubscribers.mockReturnValue({ data: null, isLoading: false });
    useAdminBookings.mockReturnValue({ data: null, isLoading: false, isError: true, refetch });

    renderDashboard();

    expect(screen.getByRole('alert')).toHaveTextContent(/bookings could not be loaded/i);
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(refetch).toHaveBeenCalled();
  });

  it('opens booking details from the view action', () => {
    useContactMessages.mockReturnValue({
      data: { data: { data: { messages: [], total: 0, limit: 20 } } },
      isLoading: false,
    });
    useNewsletterSubscribers.mockReturnValue({ data: null, isLoading: false });

    renderDashboard();
    fireEvent.click(screen.getAllByRole('button', { name: /^view$/i })[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Need help with a portfolio build.')).toBeInTheDocument();
  });

  it('submits edited booking payload', async () => {
    const mutateAsync = vi.fn().mockResolvedValue({});
    useUpdateBooking.mockReturnValue({ mutateAsync, isPending: false, error: null });
    useContactMessages.mockReturnValue({
      data: { data: { data: { messages: [], total: 0, limit: 20 } } },
      isLoading: false,
    });
    useNewsletterSubscribers.mockReturnValue({ data: null, isLoading: false });

    renderDashboard();
    fireEvent.click(screen.getAllByRole('button', { name: /^edit$/i })[0]);
    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: 'Mara Updated' } });
    fireEvent.click(screen.getByRole('button', { name: /save booking/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        bookingId: 'booking-1',
        payload: expect.objectContaining({
          name: 'Mara Updated',
          slotStart: '2099-02-02T16:00:00.000Z',
        }),
      });
    });
  });

  it('confirms cancel and delete actions', async () => {
    const cancelMutate = vi.fn().mockResolvedValue({});
    const deleteMutate = vi.fn().mockResolvedValue({});
    useCancelBooking.mockReturnValue({ mutateAsync: cancelMutate, isPending: false, error: null });
    useDeleteBooking.mockReturnValue({ mutateAsync: deleteMutate, isPending: false, error: null });
    useContactMessages.mockReturnValue({
      data: { data: { data: { messages: [], total: 0, limit: 20 } } },
      isLoading: false,
    });
    useNewsletterSubscribers.mockReturnValue({ data: null, isLoading: false });

    renderDashboard();

    fireEvent.click(screen.getAllByRole('button', { name: /^cancel$/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /cancel booking/i }));
    await waitFor(() => {
      expect(cancelMutate).toHaveBeenCalledWith('booking-1');
    });

    fireEvent.click(screen.getByLabelText(/close booking panel/i));
    fireEvent.click(screen.getAllByRole('button', { name: /^delete$/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /delete booking/i }));
    await waitFor(() => {
      expect(deleteMutate).toHaveBeenCalledWith('booking-1');
    });
  });

  it('disables cancel for cancelled bookings', () => {
    useContactMessages.mockReturnValue({
      data: { data: { data: { messages: [], total: 0, limit: 20 } } },
      isLoading: false,
    });
    useNewsletterSubscribers.mockReturnValue({ data: null, isLoading: false });

    renderDashboard();

    expect(screen.getAllByRole('button', { name: /^cancel$/i })[1]).toBeDisabled();
  });
});

describe('AdminDashboard logout', () => {
  it('calls logout mutation when logout button is clicked', () => {
    const mutate = vi.fn();
    useLogoutAdmin.mockReturnValue({ mutate, isPending: false });
    useContactMessages.mockReturnValue({
      data: { data: { data: { messages: [], total: 0, limit: 20 } } },
      isLoading: false,
    });
    useNewsletterSubscribers.mockReturnValue({ data: null, isLoading: false });

    renderDashboard();
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(mutate).toHaveBeenCalled();
  });
});
