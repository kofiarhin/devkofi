// src/components/Footer.jsx
import "./footer.styles.scss";
import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        © <span>DevKofi</span>. All rights reserved.
      </p>
      <div className="footer-socials">
        <a
          href="https://github.com/kofiarhin"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.instagram.com/escodebar/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
        <a
          href="https://x.com/kwofiArhin"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <FaTwitter />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
