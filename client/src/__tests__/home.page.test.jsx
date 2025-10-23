import { screen } from '@testing-library/react';
import Home from '../Pages/Home/Home';
import { renderWithProviders } from '../tests/utils/renderWithProviders';

describe('Home page', () => {
  it('renders the hero with CTAs and trust indicators', () => {
    renderWithProviders(<Home />);

    expect(screen.getByRole('heading', { name: /mentorship that ships real products/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start devkofi onboarding/i })).toHaveAttribute('href', '/onboarding?step=1');
    expect(screen.getByRole('link', { name: /browse devkofi courses/i })).toHaveAttribute('href', '/courses');
    expect(screen.getByText(/2,400\+ builders/i)).toBeInTheDocument();
  });

  it('lists key outcomes in the feature grid', () => {
    renderWithProviders(<Home />);

    expect(screen.getByText(/Production launch playbooks/i)).toBeInTheDocument();
    expect(screen.getByText(/1:1 mentorship/i)).toBeInTheDocument();
    expect(screen.getByText(/Progress analytics dashboard/i)).toBeInTheDocument();
  });

  it('offers a follow-up call to action section', () => {
    renderWithProviders(<Home />);

    expect(screen.getByRole('heading', { name: /ready to launch/i })).toBeInTheDocument();
    const onboardingCta = screen.getByRole('link', { name: /start onboarding/i });
    expect(onboardingCta).toHaveAttribute('href', '/onboarding?step=1');
  });
});
