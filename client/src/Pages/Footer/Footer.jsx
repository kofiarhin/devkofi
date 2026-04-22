import React from "react";
import { Link } from "react-router-dom";
import "./footer.styles.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="footer-logo">DevKofi</h2>
            <p className="footer-tagline">Build, code, and scale.</p>
          </div>

          <div className="footer-links-grid">
            <div className="footer-column">
              <h4 className="column-title">Navigation</h4>
              <ul className="column-list">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/projects">Projects</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="column-title">Legal</h4>
              <ul className="column-list">
                <li>
                  <a href="/terms">Terms of Use</a>
                </li>
                <li>
                  <a href="/privacy">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright-text">
            &copy; {currentYear} DevKofi. All rights reserved.
          </p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noreferrer">
              Github
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
