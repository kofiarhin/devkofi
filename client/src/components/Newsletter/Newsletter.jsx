// src/components/Newsletter.jsx
import "./newsletter.styles.scss";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useJoinNewsletterMutation from "../../hooks/useJoinNewsletterMutation";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import {
  aboutMeImage,
  profileImage,
  profileSmall,
} from "../../constants/constants";

// Parent section: stagger children like Pricing cards
const sectionVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

// Heading animation (matches Pricing style)
const headingVariant = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Paragraph fade-up
const paragraphVariant = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Image subtle float-in + hover lift
const imageVariant = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 12, delay: 0.15 },
  },
};

// Form pop-in (spring)
const formVariant = {
  hidden: { opacity: 0, scale: 0.95, y: 6 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 12, delay: 0.2 },
  },
};

// Input focus/hover container
const inputContainerVariant = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", delay: 0.25 },
  },
};

// Error message slide/fade
const errorVariant = {
  hidden: { opacity: 0, y: -6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

const Newsletter = () => {
  const navigate = useNavigate();
  const { data, mutate, isPending, isSuccess, error } =
    useJoinNewsletterMutation();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    mutate({ email });
    setEmail("");
  };

  if (isPending) {
    return <Spinner />;
  }
  if (isSuccess && !data?.error) {
    navigate("/success?type=newsletter");
  }

  return (
    <motion.section
      id="newsletter"
      variants={sectionVariant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Animated Heading */}
      <motion.h1 className="heading center" variants={headingVariant}>
        Get Free Developer Tips & Tools Every Week
      </motion.h1>

      {/* Profile Image */}
      <motion.div
        className="image-wrapper"
        variants={imageVariant}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <img src={profileSmall} alt="" />
      </motion.div>

      {/* Animated Paragraph */}
      <motion.p variants={paragraphVariant}>
        Learn faster, code smarter, and get insider developer tips delivered
        every Monday
      </motion.p>

      {/* Animated Form */}
      <motion.form
        className="newsletter-form"
        onSubmit={handleNewsletterSubmit}
        variants={formVariant}
      >
        <motion.div
          className="input-wrapper"
          variants={inputContainerVariant}
          whileHover={{ scale: 1.01 }}
          whileFocusWithin={{ scale: 1.01 }}
        >
          <motion.input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            whileFocus={{ outlineWidth: 0 }}
          />
        </motion.div>

        <AnimatePresence>
          {data && data?.error && (
            <motion.p
              className="text-error"
              variants={errorVariant}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {data?.error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Subscribe
        </motion.button>
      </motion.form>
    </motion.section>
  );
};

export default Newsletter;
