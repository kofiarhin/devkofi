import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import useMentorshipMutation from "../../hooks/useMentorshipMutation";
import { motion } from "framer-motion";
import { pricingData } from "./pricingData";
import "./mentorship.styles.scss";

// Animation variants
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

const packageOptions = pricingData.map((pkg) => pkg.title);

const MentorshipForm = () => {
  const navigate = useNavigate();
  const { mutate, isPending, data } = useMentorshipMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    packageName: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: (res) => {
        if (res && res.success) {
          navigate("/success?type=mentorship");
        }
      },
    });
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      packageName: "",
    });
  };

  if (isPending) return <Spinner />;

  return (
    <section className="mentorship">
      <motion.div
        className="overlay"
        variants={containerVariant}
        initial="hidden"
        animate="show"
      >
        {/* Heading */}
        <motion.h1 className="heading" variants={headingVariant}>
          Join Mentorship
        </motion.h1>

        <motion.p variants={headingVariant}>
          Enter your information, and I’ll contact you soon.
        </motion.p>

        {/* Form */}
        <motion.form className="form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <motion.div className="form-group" variants={fieldVariant}>
            <label htmlFor="fullName">Full Name*</label>
            <input
              id="fullName"
              placeholder="e.g. Jane Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </motion.div>

          {/* Email */}
          <motion.div className="form-group" variants={fieldVariant}>
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </motion.div>

          {/* Phone */}
          <motion.div className="form-group" variants={fieldVariant}>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              placeholder="e.g. +44 1234 567890"
              value={formData.phone}
              onChange={handleChange}
            />
          </motion.div>

          {/* Package */}
          <motion.div className="form-group" variants={fieldVariant}>
            <label htmlFor="packageName">Select Package*</label>
            <select
              id="packageName"
              value={formData.packageName}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Choose a package
              </option>
              {packageOptions.map((pkg) => (
                <option key={pkg} value={pkg}>
                  {pkg}
                </option>
              ))}
            </select>
          </motion.div>

          {/* API Error */}
          {data && data.error && (
            <motion.p
              className="text-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {data.error}
            </motion.p>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="primary-btn"
            variants={buttonVariant}
            whileHover="hover"
            whileTap="tap"
          >
            Submit
          </motion.button>
        </motion.form>

        {/* Actions */}
        <motion.div className="actions" variants={buttonVariant}>
          <Link to="/" className="secondary-btn">
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default MentorshipForm;
