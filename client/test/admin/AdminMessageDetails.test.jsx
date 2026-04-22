import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import authReducer from '../../src/redux/auth/authSlice';
import AdminMessageDetails from '../../src/Pages/AdminMessageDetails/AdminMessageDetails';

vi.mock('../../src/hooks/queries/useContactMessage');

import useContactMessage from '../../src/hooks/queries/useContactMessage';

const ADMIN = { email: 'admin@devkofi.com', role: 'admin' };

const makeStore = () =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { admin: ADMIN, isChecked: true } },
  });

const renderPage = () => {
  const store = makeStore();
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/messages/123']}>
          <Routes>
            <Route path="/admin/messages/:messageId" element={<AdminMessageDetails />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
};

describe('AdminMessageDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  it('shows loading state while request is pending', () => {
    useContactMessage.mockReturnValue({ isLoading: true, isFetching: false });

    renderPage();

    expect(screen.getByText(/loading message details/i)).toBeInTheDocument();
  });

  it('renders message details and actions', () => {
    useContactMessage.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        data: {
          data: {
            message: {
              _id: '123',
              name: 'Alice',
              email: 'alice@test.com',
              subject: 'Need help',
              message: 'Line one\nLine two',
              createdAt: '2026-04-20T00:00:00.000Z',
              isRead: false,
              readAt: null,
            },
          },
        },
      },
    });

    renderPage();

    expect(screen.getByText('Message Details')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Need help')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /reply/i })).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:alice@test.com?subject=Re%3A%20Need%20help')
    );
  });

  it('shows not found state for 404', () => {
    useContactMessage.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: true,
      error: { response: { status: 404 } },
    });

    renderPage();

    expect(screen.getByText(/message not found/i)).toBeInTheDocument();
  });

  it('copies email to clipboard', async () => {
    useContactMessage.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        data: {
          data: {
            message: {
              _id: '123',
              name: 'Alice',
              email: 'alice@test.com',
              subject: 'Need help',
              message: 'Line one\nLine two',
              createdAt: '2026-04-20T00:00:00.000Z',
              isRead: false,
              readAt: null,
            },
          },
        },
      },
    });

    renderPage();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy email/i }));
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('alice@test.com');
  });
});
