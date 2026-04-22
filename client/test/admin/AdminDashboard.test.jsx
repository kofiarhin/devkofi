import { render, screen, fireEvent } from '@testing-library/react';
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
vi.mock('../../src/hooks/mutations/useLogoutAdmin');

import useContactMessages from '../../src/hooks/queries/useContactMessages';
import useNewsletterSubscribers from '../../src/hooks/queries/useNewsletterSubscribers';
import useLogoutAdmin from '../../src/hooks/mutations/useLogoutAdmin';

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

beforeEach(() => {
  vi.clearAllMocks();
  useLogoutAdmin.mockReturnValue({ mutate: vi.fn(), isPending: false });
});

describe('AdminDashboard — Contact Messages tab', () => {
  it('renders messages from mock data', () => {
    useContactMessages.mockReturnValue({
      data: { data: { data: { messages: mockMessages, total: 1, limit: 20 } } },
      isLoading: false,
    });
    useNewsletterSubscribers.mockReturnValue({ data: null, isLoading: false });

    renderDashboard();

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

    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
  });
});

describe('AdminDashboard — Newsletter Subscribers tab', () => {
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
    fireEvent.click(screen.getByRole('button', { name: /newsletter subscribers/i }));

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
    fireEvent.click(screen.getByRole('button', { name: /newsletter subscribers/i }));

    expect(screen.getByText(/no subscribers yet/i)).toBeInTheDocument();
  });
});

describe('AdminDashboard — logout', () => {
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
