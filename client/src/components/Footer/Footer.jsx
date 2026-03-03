import { motion } from "framer-motion";
import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import "./footer.styles.scss";

const footerVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const listContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const sections = [
  {
    title: "Platform",
    links: [
      { label: "AI-Powered MERN Engineering", href: "/" },
      { label: "Course Outline", href: "/#course-outline" },
      { label: "Enroll", href: "/register" },
    ],
  },
  {
    title: "Workflow",
    links: [
      { label: "Planning to Deployment", href: "/" },
      { label: "Prompt Structuring", href: "/" },
      { label: "Testing and Refactoring", href: "/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Projects", href: "/projects" },
      { label: "YouTube", href: "/youtube" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Use", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const socials = [
  { href: "https://github.com/kofiarhin", icon: <FaGithub />, label: "GitHub" },
  {
    href: "https://www.instagram.com/escodebar/",
    icon: <FaInstagram />,
    label: "Instagram",
  },
  { href: "https://x.com/kwofiArhin", icon: <FaTwitter />, label: "Twitter" },
];

const Footer = () => {
  return (
    <motion.footer
      className="footer container"
      variants={footerVariant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="footer__top">
        <div className="brand">
          <a href="/" aria-label="DevKofi Home">
            <span className="brand__name">DevKofi</span>
            <p>AI-powered engineering. Production-first MERN execution.</p>
          </a>
        </div>

        <div className="grid">
          {sections.map((sec) => (
            <motion.div
              key={sec.title}
              className="col"
              variants={listContainer}
              initial="hidden"
              whileInView="show"
            >
              <motion.h4 variants={item}>{sec.title.toUpperCase()}</motion.h4>
              <ul>
                {sec.links.map((l) => (
                  <motion.li key={l.label} variants={item}>
                    <a href={l.href}>{l.label}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="footer__bottom">
        <p>
          © <span>DevKofi</span>. AI is not replacing the engineer. AI is your
          execution partner.
        </p>

        <div className="footer-socials">
          {socials.map(({ href, icon, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              title={label}
              whileHover={{ scale: 1.15, y: -2, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              {icon}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
