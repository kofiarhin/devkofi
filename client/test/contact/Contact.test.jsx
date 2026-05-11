import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Contact from '../../src/Pages/Contact/Contact';
import useContactMutation from '../../src/hooks/useContactMutation';

vi.mock('../../src/hooks/useContactMutation');

const mutationState = {
  mutate: vi.fn(),
  reset: vi.fn(),
  isPending: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const renderContact = () => render(<Contact />);

describe('Contact page empty state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useContactMutation.mockReturnValue(mutationState);
  });

  it('shows the empty state before any contact form content is entered', () => {
    renderContact();

    expect(
      screen.getByText('Start by entering your details and message.')
    ).toBeInTheDocument();
  });

  it('hides the empty state after the visitor types in a field', async () => {
    const user = userEvent.setup();
    renderContact();

    await user.type(screen.getByLabelText(/name/i), 'Ava Morgan');

    expect(
      screen.queryByText('Start by entering your details and message.')
    ).not.toBeInTheDocument();
  });

  it('hides the empty state after a prompt chip fills the form', async () => {
    const user = userEvent.setup();
    renderContact();

    await user.click(screen.getByRole('button', { name: /dashboard/i }));

    expect(
      screen.queryByText('Start by entering your details and message.')
    ).not.toBeInTheDocument();
  });
});
