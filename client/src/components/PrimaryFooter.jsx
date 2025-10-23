import { Link } from 'react-router-dom';
import './primary-footer.styles.scss';

const PrimaryFooter = () => (
  <footer className="primary-footer" role="contentinfo">
    <div className="container primary-footer-inner">
      <div>
        <h2 className="primary-footer-title">DevKofi</h2>
        <p className="primary-footer-text">
          Mentorship and courses guiding developers from idea to launch with accountability, community, and real-world builds.
        </p>
      </div>
      <nav className="primary-footer-links" aria-label="Footer">
        <Link to="/" className="primary-footer-link">
          Home
        </Link>
        <Link to="/courses" className="primary-footer-link">
          Courses
        </Link>
        <Link to="/mentorship" className="primary-footer-link">
          Mentorship
        </Link>
        <Link to="/blog" className="primary-footer-link">
          Blog
        </Link>
        <Link to="/contact" className="primary-footer-link">
          Contact
        </Link>
      </nav>
      <div className="primary-footer-meta">
        <a href="https://www.twitter.com/devkofi" className="primary-footer-link" target="_blank" rel="noreferrer">
          Twitter
        </a>
        <a href="https://www.youtube.com/@devkofi" className="primary-footer-link" target="_blank" rel="noreferrer">
          YouTube
        </a>
        <a href="mailto:hello@devkofi.com" className="primary-footer-link">
          hello@devkofi.com
        </a>
      </div>
    </div>
    <div className="primary-footer-bottom">
      <div className="container primary-footer-bottom-inner">
        <p className="primary-footer-small">© {new Date().getFullYear()} DevKofi. All rights reserved.</p>
        <div className="primary-footer-bottom-links">
          <Link to="/privacy" className="primary-footer-link">
            Privacy
          </Link>
          <Link to="/terms" className="primary-footer-link">
            Terms
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default PrimaryFooter;
