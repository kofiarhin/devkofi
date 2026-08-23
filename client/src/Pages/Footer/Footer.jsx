import { createElement } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  StackSimple,
  XLogo,
} from "@phosphor-icons/react";
import "./footer.styles.scss";

const navigationLinks = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Lab", to: "/lab" },
  { label: "Journal", to: "/journal" },
];

const actionLinks = [
  { label: "Start a project", to: "/start-a-project" },
  { label: "View work", to: "/work" },
  { label: "Explore the lab", to: "/lab" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/kofiarhin",
    icon: GithubLogo,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: LinkedinLogo,
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: XLogo,
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <section className="footer-cta" aria-label="Start a project">
          <div className="footer-cta__signal">
            <span className="footer-status-dot" aria-hidden="true" />
            Booking selected projects
          </div>

          <div className="footer-cta__content">
            <h2>Good products start with an honest conversation.</h2>
            <p>
              Bring the ambitious idea, the stuck product, or the next release.
              We will find the clearest path from here to useful.
            </p>
          </div>

          <Link to="/start-a-project" className="footer-cta__button">
            Start a project
            <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </Link>
        </section>

        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="DevKofi home">
              Dev<span>Kofi</span>
            </Link>
            <p className="footer-tagline">
              A Kofi-led creative technology studio shaping, designing, and
              building useful digital products.
            </p>

            <a className="footer-email" href="mailto:kofiarhin69@gmail.com">
              <EnvelopeSimple size={18} weight="duotone" aria-hidden="true" />
              kofiarhin69@gmail.com
            </a>
          </div>

          <div className="footer-links-grid">
            <div className="footer-column">
              <h3 className="column-title">Navigate</h3>
              <ul className="column-list">
                {navigationLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="column-title">Explore</h3>
              <ul className="column-list">
                {actionLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-mark" aria-hidden="true">
            <StackSimple size={17} weight="duotone" />
            Shape · Design · Build
          </div>

          <p className="copyright-text">
            &copy; {currentYear} DevKofi. All rights reserved.
          </p>

          <div className="social-links">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
              >
                {createElement(Icon, {
                  size: 17,
                  weight: "fill",
                  "aria-hidden": true,
                })}
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
