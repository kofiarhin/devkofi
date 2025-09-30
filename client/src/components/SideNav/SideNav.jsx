import "./sideNav.styles.scss";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleNav } from "../../redux/navigation/navigationSlice";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SideNav = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.navigation);
  const { user } = useSelector((state) => state.auth);
  const handleToggleNav = () => {
    dispatch(toggleNav());
  };

  // Container animation (scale + rotate + fade)
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: [0.175, 0.885, 0.32, 1.275], // elastic spring
        when: "beforeChildren",
        staggerChildren: 0.15,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.7,
      rotate: 10,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  // Link animation (pop + bounce)
  const linkVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20,
      },
    },
  };

  // Build links without empty entries (avoids duplicate key="")
  const links = [
    { to: "/", text: "Home" },
    { to: "/about-me", text: "About Me" },
    { to: "/course-outline", text: "Course Outline" },
    { to: "/chat", text: "Chat" },
    !user && { to: "/register", text: "Register" },
    user && { to: "/portal", text: "Portal" },
    !user && { to: "/login", text: "Login" },
    { to: "/contact", text: "Contact" },
    ...(import.meta.env.DEV ? [{ to: "/playground", text: "Playground" }] : []),
  ].filter(Boolean);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="sideNav"
          className="close"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <FaTimes className="close" onClick={handleToggleNav} />

          {links.map((link, i) => (
            <motion.div key={`${link.to}-${link.text}`} variants={linkVariants}>
              <Link to={link.to} onClick={handleToggleNav}>
                {link.text}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SideNav;
