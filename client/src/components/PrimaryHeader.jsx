import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import AccessibleButton from './AccessibleButton.jsx';
import NavMenu from './NavMenu.jsx';
import './primary-header.styles.scss';

const links = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/mentorship', label: 'Mentorship' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

const PrimaryHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = links.map((link) => ({
    ...link,
    component: NavLink,
  }));

  return (
    <header className="primary-header" role="banner">
      <div className="container primary-header-bar">
        <div className="primary-header-brand">
          <Link to="/" className="primary-header-logo" aria-label="DevKofi home">
            Dev<span className="primary-header-logo-accent">Kofi</span>
          </Link>
        </div>
        <nav className="primary-header-nav" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `primary-header-link${isActive ? ' primary-header-link--active' : ''}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="primary-header-cta">
          <AccessibleButton as={Link} to="/login" className="btn btn--ghost">
            Login
          </AccessibleButton>
          <AccessibleButton as={Link} to="/register" className="btn btn--primary">
            Join mentorship
          </AccessibleButton>
          <AccessibleButton
            className="primary-header-menu"
            aria-label="Open navigation"
            onClick={() => setIsMenuOpen(true)}
          >
            ☰
          </AccessibleButton>
        </div>
      </div>
      <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} links={navLinks} />
      <div className="primary-header-indicator" aria-hidden="true">
        <span className="primary-header-current">{location.pathname}</span>
      </div>
    </header>
  );
};

export default PrimaryHeader;
