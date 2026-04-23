import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import LandingBase from './LandingBase';
import AnimatedPhrase from './AnimatedPhrase';
import './landing.styles.scss';

const HERO_TITLE_SELECTORS = [
  '[data-hero-title]',
  '[data-testid="hero-title"]',
  '.hero__title',
  '.hero-title',
  '.landing__title',
  'h1',
];

const HeroHeadline = () => (
  <span className="landing-animated-heading__overlay">
    <span className="landing-animated-heading__line">Mentoring MERN Devs</span>
    <span className="landing-animated-heading__line">
      with <AnimatedPhrase />
    </span>
    <span className="landing-animated-heading__line">into AI Engineers</span>
  </span>
);

const Landing = () => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const wrapperElement = wrapperRef.current;

    if (!wrapperElement) {
      return undefined;
    }

    const headingElement = HERO_TITLE_SELECTORS.map((selector) => wrapperElement.querySelector(selector)).find(Boolean);

    if (!headingElement) {
      return undefined;
    }

    const overlayMount = document.createElement('span');
    const computedHeadingStyle = window.getComputedStyle(headingElement);
    const originalPosition = headingElement.style.position;
    const originalAriaLabel = headingElement.getAttribute('aria-label');

    overlayMount.className = 'landing-animated-heading__mount';

    headingElement.classList.add('landing-animated-heading');
    headingElement.style.setProperty('--landing-heading-color', computedHeadingStyle.color);
    headingElement.style.position = computedHeadingStyle.position === 'static' ? 'relative' : computedHeadingStyle.position;
    headingElement.setAttribute('aria-label', 'Mentoring MERN Devs with AI tools into AI Engineers');
    headingElement.appendChild(overlayMount);

    const overlayRoot = createRoot(overlayMount);
    overlayRoot.render(<HeroHeadline />);

    return () => {
      overlayRoot.unmount();

      if (overlayMount.parentNode === headingElement) {
        headingElement.removeChild(overlayMount);
      }

      headingElement.classList.remove('landing-animated-heading');
      headingElement.style.removeProperty('--landing-heading-color');
      headingElement.style.position = originalPosition;

      if (originalAriaLabel === null) {
        headingElement.removeAttribute('aria-label');
      } else {
        headingElement.setAttribute('aria-label', originalAriaLabel);
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} className="landing-animated-phrase-root">
      <LandingBase />
    </div>
  );
};

export default Landing;
