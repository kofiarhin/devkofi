import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import authReducer from '../../src/redux/auth/authSlice';
import navigationReducer from '../../src/redux/navigation/navigationSlice';
import Header from '../../src/components/Header/Header';
import SideNav from '../../src/components/SideNav/SideNav';
import AdminRoute from '../../src/components/AdminRoute/AdminRoute';
import { AppRoutes } from '../../src/App';

vi.mock('../../src/hooks/queries/useAdminSession', () => ({
  default: vi.fn(() => ({})),
}));

vi.mock('../../src/hooks/mutations/useLogoutAdmin', () => ({
  default: vi.fn(),
}));

vi.mock('../../src/Pages/Home/Home', () => ({
  default: () => <main>Home page</main>,
}));

vi.mock('../../src/Pages/About/About', () => ({
  default: () => <main>About page</main>,
}));

vi.mock('../../src/Pages/Projects/Projects', () => ({
  default: () => <main>Projects page</main>,
}));

vi.mock('../../src/Pages/Contact/Contact', () => ({
  default: () => <main>Contact page</main>,
}));

vi.mock('../../src/Pages/BookCall/BookCall', () => ({
  default: () => <main>Book call page</main>,
}));

vi.mock('../../src/Pages/Login/AdminLogin', () => ({
  default: () => <main>Admin login page</main>,
}));

vi.mock('../../src/Pages/AdminDashboard/AdminDashboard', () => ({
  default: () => <main>Admin dashboard page</main>,
}));

vi.mock('../../src/Pages/AdminMessageDetails/AdminMessageDetails', () => ({
  default: () => <main>Admin message details page</main>,
}));

import useLogoutAdmin from '../../src/hooks/mutations/useLogoutAdmin';

const ADMIN = { email: 'admin@devkofi.com', role: 'admin' };

const makeStore = ({ admin = null, isChecked = true, isOpen = false } = {}) =>
  configureStore({
    reducer: {
      auth: authReducer,
      navigation: navigationReducer,
    },
    preloadedState: {
      auth: { admin, isChecked },
      navigation: { isOpen },
    },
  });

const renderWithProviders = (
  ui,
  {
    route = '/',
    admin = null,
    isChecked = true,
    isOpen = false,
  } = {}
) => {
  const store = makeStore({ admin, isChecked, isOpen });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
};

describe('admin navigation preservation', () => {
  const logoutMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useLogoutAdmin.mockReturnValue({ mutate: logoutMock, isPending: false });
  });

  it('keeps public header links and hides admin actions when unauthenticated', () => {
    renderWithProviders(<Header />);

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });

  it('shows dashboard and logout in the public header when admin is authenticated', () => {
    renderWithProviders(<Header />, { admin: ADMIN });

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute(
      'href',
      '/admin/dashboard'
    );
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('renders the shared header on the protected dashboard route', () => {
    renderWithProviders(<AppRoutes />, {
      route: '/admin/dashboard',
      admin: ADMIN,
      isChecked: true,
    });

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/admin dashboard page/i)).toBeInTheDocument();
  });

  it('renders the shared header on protected admin detail routes', () => {
    renderWithProviders(<AppRoutes />, {
      route: '/admin/messages/123',
      admin: ADMIN,
      isChecked: true,
    });

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/admin message details page/i)).toBeInTheDocument();
  });

  it('mirrors admin-aware links in the mobile side nav', () => {
    const { unmount } = renderWithProviders(<SideNav />);

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();

    unmount();
    renderWithProviders(<SideNav />, { admin: ADMIN, route: '/admin/dashboard' });

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('calls the logout mutation from mobile navigation', () => {
    renderWithProviders(<SideNav />, { admin: ADMIN, isOpen: true });

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it('still redirects unauthenticated users away from protected admin routes', () => {
    renderWithProviders(<AppRoutes />, {
      route: '/admin/dashboard',
      admin: null,
      isChecked: true,
    });

    expect(screen.getByText(/admin login page/i)).toBeInTheDocument();
    expect(screen.queryByText(/admin dashboard page/i)).not.toBeInTheDocument();
  });

  it('keeps the protected route loading state while admin auth is unchecked', () => {
    renderWithProviders(<AdminRoute />, { admin: null, isChecked: false });

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });
});
