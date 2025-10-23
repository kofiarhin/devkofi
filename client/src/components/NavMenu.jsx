import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AccessibleButton from './AccessibleButton.jsx';
import './nav-menu.styles.scss';

const NavMenu = ({ isOpen, onClose, links }) => {
  const menuRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex="0"]'
        );
        if (!focusable.length) {
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      window.setTimeout(() => {
        const firstLink = menuRef.current?.querySelector('a, button');
        firstLink?.focus();
      }, 0);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElement.current?.focus?.();
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="nav-menu" role="dialog" aria-modal="true" aria-label="Primary navigation">
      <div className="nav-menu-backdrop" onClick={onClose} role="presentation" />
      <div className="nav-menu-panel" ref={menuRef}>
        <div className="nav-menu-header">
          <h2 className="nav-menu-title">Menu</h2>
          <AccessibleButton className="btn btn--ghost nav-menu-close" onClick={onClose} aria-label="Close menu">
            ✕
          </AccessibleButton>
        </div>
        <nav className="nav-menu-links" aria-label="Mobile">
          {links.map((link) => (
            <AccessibleButton key={link.to} as={link.component} to={link.to} className="nav-menu-link" onClick={onClose}>
              {link.label}
            </AccessibleButton>
          ))}
        </nav>
      </div>
    </div>
  );
};

NavMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      component: PropTypes.elementType.isRequired,
    })
  ).isRequired,
};

export default NavMenu;
