import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import useSiteContent from "../../hooks/useSiteContent";
import styles from "./navBar.styles.module.scss";

const NavBar = () => {
  const navigation = useSiteContent("navigation");
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (menuRef.current?.contains(event.target)) {
        return;
      }

      if (buttonRef.current?.contains(event.target)) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  if (!navigation) {
    return null;
  }

  const { brand, menuLabel, links = [], cta } = navigation;

  const renderDesktopLink = (item) => {
    if (item.external) {
      return (
        <a
          key={item.label}
          className={styles.link}
          href={item.to}
          target="_blank"
          rel="noreferrer"
        >
          {item.label}
        </a>
      );
    }

    return (
      <NavLink
        key={item.label}
        to={item.to}
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
        end={item.to === "/"}
      >
        {item.label}
      </NavLink>
    );
  };

  const renderMobileLink = (item) => {
    if (item.external) {
      return (
        <a
          key={item.label}
          className={styles.mobileLink}
          href={item.to}
          target="_blank"
          rel="noreferrer"
        >
          {item.label}
        </a>
      );
    }

    return (
      <NavLink
        key={item.label}
        to={item.to}
        className={({ isActive }) =>
          isActive ? styles.mobileActive : styles.mobileLink
        }
        end={item.to === "/"}
      >
        {item.label}
      </NavLink>
    );
  };

  const renderCta = () => {
    if (!cta) {
      return null;
    }

    if (cta.external) {
      return (
        <a className={styles.cta} href={cta.to} target="_blank" rel="noreferrer">
          {cta.label}
        </a>
      );
    }

    return (
      <Link className={styles.cta} to={cta.to}>
        {cta.label}
      </Link>
    );
  };

  const renderMobileCta = () => {
    if (!cta) {
      return null;
    }

    if (cta.external) {
      return (
        <a className={styles.mobileLink} href={cta.to} target="_blank" rel="noreferrer">
          {cta.label}
        </a>
      );
    }

    return (
      <NavLink
        to={cta.to}
        className={({ isActive }) =>
          isActive ? styles.mobileActive : styles.mobileLink
        }
      >
        {cta.label}
      </NavLink>
    );
  };

  const handleToggle = () => {
    setOpen((previous) => !previous);
  };

  const mobilePanelClassName = open
    ? `${styles.mobilePanel} ${styles.mobilePanelOpen}`
    : styles.mobilePanel;

  return (
    <nav className={styles.nav} role="navigation" aria-label="Main Navigation">
      <div className={styles.inner}>
        <Link className={styles.brand} to="/">
          {brand}
        </Link>

        <div className={styles.desktopLinks} aria-label="Desktop Navigation">
          {links.map(renderDesktopLink)}
          {renderCta()}
        </div>

        <button
          ref={buttonRef}
          className={styles.mobileButton}
          aria-label={menuLabel}
          aria-controls="mobile-menu"
          aria-expanded={open ? "true" : "false"}
          onClick={handleToggle}
          type="button"
        >
          {menuLabel}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={mobilePanelClassName}
        aria-hidden={open ? "false" : "true"}
      >
        <ul className={styles.mobileList}>
          {links.map((item) => (
            <li key={item.label} className={styles.mobileItem}>
              {renderMobileLink(item)}
            </li>
          ))}
          {cta ? (
            <li className={styles.mobileItem}>{renderMobileCta()}</li>
          ) : null}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
