import PropTypes from 'prop-types';
import AccessibleButton from './AccessibleButton.jsx';
import './hero.styles.scss';

const Hero = ({ title, subtitle, primaryCta, secondaryCta, trustItems }) => (
  <section className="hero" role="region" aria-label="Intro">
    <div className="container hero-content">
      <div className="hero-copy">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle prose">{subtitle}</p>
        <div className="hero-actions">
          <AccessibleButton
            as="a"
            href={primaryCta.href}
            className="btn btn--primary primary-cta"
            aria-label={primaryCta.label}
          >
            {primaryCta.text}
          </AccessibleButton>
          {secondaryCta ? (
            <AccessibleButton
              as="a"
              href={secondaryCta.href}
              className="btn btn--ghost secondary-cta"
              aria-label={secondaryCta.label}
            >
              {secondaryCta.text}
            </AccessibleButton>
          ) : null}
        </div>
        {trustItems?.length ? (
          <div className="trust-row" aria-label="Trusted by">
            {trustItems.map((item) => (
              <div className="trust-item" key={item.label}>
                <span className="trust-label">{item.label}</span>
                <p className="trust-text">{item.text}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  </section>
);

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  primaryCta: PropTypes.shape({
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  secondaryCta: PropTypes.shape({
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
  trustItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ),
};

Hero.defaultProps = {
  secondaryCta: null,
  trustItems: [],
};

export default Hero;
