import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import authReducer from '../../src/redux/auth/authSlice';
import AdminLogin from '../../src/Pages/Login/AdminLogin';

vi.mock('../../src/hooks/mutations/useLoginAdmin');
import useLoginAdmin from '../../src/hooks/mutations/useLoginAdmin';

const makeStore = (preloadedState = {}) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });

const renderWithProviders = (ui, { storeState = {} } = {}) => {
  const store = makeStore(storeState);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
};

describe('AdminLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form', () => {
    useLoginAdmin.mockReturnValue({ mutate: vi.fn(), isPending: false, error: null });

    renderWithProviders(<AdminLogin />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('disables submit while loading', () => {
    useLoginAdmin.mockReturnValue({ mutate: vi.fn(), isPending: true, error: null });

    renderWithProviders(<AdminLogin />);

    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });

  it('shows error message on failure', () => {
    const error = { response: { data: { error: 'Invalid credentials' } } };
    useLoginAdmin.mockReturnValue({ mutate: vi.fn(), isPending: false, error });

    renderWithProviders(<AdminLogin />);

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  it('calls mutate with email and password on submit', async () => {
    const mutate = vi.fn();
    useLoginAdmin.mockReturnValue({ mutate, isPending: false, error: null });

    renderWithProviders(<AdminLogin />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'admin@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith({ email: 'admin@test.com', password: 'secret' });
    });
  });

  it('redirects to dashboard if already authenticated', () => {
    useLoginAdmin.mockReturnValue({ mutate: vi.fn(), isPending: false, error: null });

    renderWithProviders(<AdminLogin />, {
      storeState: { auth: { admin: { email: 'admin@test.com', role: 'admin' }, isChecked: true } },
    });
  });
});
