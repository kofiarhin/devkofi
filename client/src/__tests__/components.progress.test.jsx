import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Hero from '../components/Hero.jsx';
import ProgressSteps from '../components/ProgressSteps.jsx';
import AccessibleButton from '../components/AccessibleButton.jsx';

describe('AccessibleButton', () => {
  it('invokes onClick when triggered via keyboard', () => {
    const handleClick = vi.fn();
    render(
      <AccessibleButton onClick={handleClick} aria-label="Demo button">
        Demo
      </AccessibleButton>
    );

    const button = screen.getByRole('button', { name: /demo/i });
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('ProgressSteps', () => {
  it('calculates percentages and announces progress', () => {
    render(<ProgressSteps current={2} total={5} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Step 2 of 5');
    expect(screen.getByText(/40% complete/)).toBeInTheDocument();
  });
});

describe('Hero', () => {
  it('renders CTA buttons with accessible labels', () => {
    render(
      <Hero
        title="Test hero"
        subtitle="Sub copy"
        primaryCta={{ href: '/join', text: 'Join now', label: 'Join DevKofi' }}
        secondaryCta={{ href: '/courses', text: 'View courses', label: 'View DevKofi courses' }}
        trustItems={[{ label: 'Community', text: '100 builders' }]}
      />
    );

    expect(screen.getByRole('link', { name: /join devkofi/i })).toHaveAttribute('href', '/join');
    expect(screen.getByText(/100 builders/)).toBeInTheDocument();
  });
});
