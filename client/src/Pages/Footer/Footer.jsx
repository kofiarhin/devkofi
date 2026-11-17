import { createElement } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, EnvelopeSimple, GithubLogo, LinkedinLogo, StackSimple, XLogo, YoutubeLogo } from "@phosphor-icons/react";
import { BOOK_CALL_LABEL, BOOK_CALL_PATH } from "../../constants/booking";
import { primaryNavItems } from "../../constants/navigation";
import "./footer.styles.scss";

const serviceLinks = [
  { label: "AI integration", to: "/ai-integration" },
  { label: "AI engineering mentorship", to: "/mentorship#ai-engineering" },
  { label: "MERN stack mentorship", to: "/mentorship#mern" },
  { label: "Case studies", to: "/work" },
  { label: "Send a message", to: "/contact" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/kofiarhin", icon: GithubLogo },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kofi-arhin", icon: LinkedinLogo },
  { label: "Twitter", href: "https://x.com/kwofiArhin", icon: XLogo },
  { label: "YouTube", href: "https://www.youtube.com/@devkofi", icon: YoutubeLogo },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <section className="footer-cta" aria-label="Book a free intro call">
          <div className="footer-cta__signal"><span className="footer-status-dot" aria-hidden="true" />AI engineer · real MERN stack experience</div>
          <div className="footer-cta__content">
            <h2>Have a system that could use AI, or skills you want to level up?</h2>
            <p>Start with a free intro call about AI integration for your business or 1-on-1 mentorship.</p>
          </div>
          <Link to={BOOK_CALL_PATH} className="footer-cta__button"><CalendarCheck size={18} weight="duotone" aria-hidden="true" />{BOOK_CALL_LABEL}<ArrowRight size={16} weight="bold" aria-hidden="true" /></Link>
        </section>

        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="DevKofi">Dev<span>Kofi</span></Link>
            <p className="footer-tagline">Kofi Arhin: AI integration into existing systems for businesses, plus 1-on-1 AI engineering and MERN stack mentorship.</p>
            <a className="footer-email" href="mailto:kofiarhin69@gmail.com"><EnvelopeSimple size={18} weight="duotone" aria-hidden="true" />kofiarhin69@gmail.com</a>
          </div>

          <div className="footer-links-grid">
            <div className="footer-column">
              <h3 className="column-title">Navigate</h3>
              <ul className="column-list">{primaryNavItems.map((link) => <li key={link.to}><Link to={link.to}>{link.label}</Link></li>)}</ul>
            </div>
            <div className="footer-column">
              <h3 className="column-title">Services</h3>
              <ul className="column-list">{serviceLinks.map((link) => <li key={link.to}><Link to={link.to}>{link.label}</Link></li>)}</ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-mark" aria-hidden="true"><StackSimple size={17} weight="duotone" />Scope → build → verify</div>
          <p className="copyright-text">&copy; {currentYear} DevKofi. All rights reserved.</p>
          <div className="social-links">{socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>{createElement(Icon, { size: 17, weight: "fill", "aria-hidden": true })}<span>{label}</span></a>)}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
