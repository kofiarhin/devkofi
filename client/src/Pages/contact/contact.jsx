import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./contact.styles.scss";
import usecontactMutation from "../../hooks/useContactMutation";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";

// Animation Variants
const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const headingVariant = {
  hidden: { opacity: 0, y: -30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const textVariant = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const fieldVariant = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const buttonVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const Contact = () => {
  const navigate = useNavigate();
  const { mutate, isPending, error, isSuccess } = usecontactMutation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate(formData);
  };

  if (error) {
    navigate("/error");
  }

  if (isPending) {
    return <Spinner />;
  }

  if (isSuccess) {
    // Clear form after submit
    setFormData({
      fullName: "",
      email: "",
      message: "",
    });
    navigate("/success");
    console.log("message sent successfully");
  }

  return (
    <section className="contact">
      <motion.div
        className="overlay"
        variants={containerVariant}
        initial="hidden"
        animate="show"
      >
        <motion.div className="text" variants={containerVariant}>
          {/* Heading */}
          <motion.h1 variants={headingVariant}>Let’s Work Together</motion.h1>

          {/* Subheading */}
          <motion.p variants={textVariant}>
            Got a project, an idea, or just want to say hello? Fill out the form
            below and I’ll get back to you as soon as possible.
          </motion.p>

          {/* Form */}
          <motion.form className="form" onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <motion.div className="form-group" variants={fieldVariant}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="fullName"
                placeholder="Your Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </motion.div>

            {/* Email Field */}
            <motion.div className="form-group" variants={fieldVariant}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </motion.div>

            {/* Message Field */}
            <motion.div className="form-group" variants={fieldVariant}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                placeholder="Your message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="primary-btn"
              variants={buttonVariant}
              whileHover="hover"
              whileTap="tap"
            >
              Send Message
            </motion.button>
          </motion.form>

          {/* Back to Home */}
          <motion.div className="actions" variants={buttonVariant}>
            <Link to="/" className="secondary-btn">
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;
