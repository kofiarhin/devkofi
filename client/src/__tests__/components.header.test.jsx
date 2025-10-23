import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import PrimaryHeader from '../components/PrimaryHeader.jsx';
import { renderWithProviders } from '../tests/utils/renderWithProviders';

describe('PrimaryHeader', () => {
  it('renders primary navigation links with active styling', () => {
    renderWithProviders(
      <Routes>
        <Route path="/*" element={<PrimaryHeader />} />
      </Routes>
    );

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /courses/i })).toHaveAttribute('href', '/courses');
  });

  it('opens and closes the mobile menu with focus trap', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/*" element={<PrimaryHeader />} />
      </Routes>
    );

    const openButton = screen.getByRole('button', { name: /open navigation/i });
    await user.click(openButton);

    const dialog = screen.getByRole('dialog', { name: /primary navigation/i });
    expect(dialog).toBeInTheDocument();

    await user.keyboard('{Tab}');
    expect(screen.getByRole('link', { name: /home/i })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(dialog).not.toBeInTheDocument();
  });

  it('renders onboarding call-to-action buttons', () => {
    renderWithProviders(
      <Routes>
        <Route path="/*" element={<PrimaryHeader />} />
      </Routes>
    );

    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /join mentorship/i })).toHaveAttribute('href', '/register');
  });
});
