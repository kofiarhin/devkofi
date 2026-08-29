import { createElement } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarBlank, EnvelopeSimple, GithubLogo, LinkedinLogo, StackSimple, XLogo } from "@phosphor-icons/react";
import { publicActionItem, publicNavItems } from "../../constants/navigation";
import "./footer.styles.scss";

const actionLinks = [
  publicActionItem,
  { label: "View work", to: "/work" },
  { label: "Explore systems", to: "/engineering-systems" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/kofiarhin", icon: GithubLogo },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinLogo },
  { label: "Twitter", href: "https://twitter.com", icon: XLogo },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <section className="footer-cta" aria-label="Start an AI engineering project">
          <div className="footer-cta__signal"><span className="footer-status-dot" aria-hidden="true" />AI engineering studio</div>
          <div className="footer-cta__content">
            <h2>Turn the AI idea into dependable software.</h2>
            <p>Bring the workflow, prototype, product, or system problem. I’ll help turn it into a clear engineering path.</p>
          </div>
          <Link to="/book-a-call" className="footer-cta__button"><CalendarBlank size={18} weight="duotone" aria-hidden="true" />Book a call<ArrowRight size={16} weight="bold" aria-hidden="true" /></Link>
        </section>

        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="DevKofi home">Dev<span>Kofi</span></Link>
            <p className="footer-tagline">Founder-led AI engineering for production AI systems, agentic workflows, and AI-native products.</p>
            <a className="footer-email" href="mailto:kofiarhin69@gmail.com"><EnvelopeSimple size={18} weight="duotone" aria-hidden="true" />kofiarhin69@gmail.com</a>
          </div>

          <div className="footer-links-grid">
            <div className="footer-column">
              <h3 className="column-title">Navigate</h3>
              <ul className="column-list">{publicNavItems.map((link) => <li key={link.to}><Link to={link.to}>{link.label}</Link></li>)}</ul>
            </div>
            <div className="footer-column">
              <h3 className="column-title">Start here</h3>
              <ul className="column-list">{actionLinks.map((link) => <li key={link.to}><Link to={link.to}>{link.label}</Link></li>)}</ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-mark" aria-hidden="true"><StackSimple size={17} weight="duotone" />Engineer → verify → improve</div>
          <p className="copyright-text">&copy; {currentYear} DevKofi. All rights reserved.</p>
          <div className="social-links">{socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>{createElement(Icon, { size: 17, weight: "fill", "aria-hidden": true })}<span>{label}</span></a>)}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
