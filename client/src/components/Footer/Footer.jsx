// src/components/Footer.jsx
import "./footer.styles.scss";
import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";

const footerVariant = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const socialContainerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const socialIconVariant = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 12 },
  },
};

const Footer = () => {
  return (
    <motion.footer
      className="footer"
      variants={footerVariant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        © <span>DevKofi</span>. All rights reserved.
      </motion.p>

      <motion.div
        className="footer-socials"
        variants={socialContainerVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.a
          href="https://github.com/kofiarhin"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          variants={socialIconVariant}
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaGithub />
        </motion.a>

        <motion.a
          href="https://www.instagram.com/escodebar/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          variants={socialIconVariant}
          whileHover={{ scale: 1.2, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaInstagram />
        </motion.a>

        <motion.a
          href="https://x.com/kwofiArhin"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          variants={socialIconVariant}
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTwitter />
        </motion.a>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
