import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import useMentorshipMutation from "../../hooks/useJoinNewsletterMutation";
import { motion } from "framer-motion";
import pricingData from "../../data/pricingData";
import useRegisterMutation from "../../hooks/useRegisterMutation";

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
const pricingOptions = pricingData.map((price) => ({
  id: price.id,
  title: price.title,
}));

const Register = () => {
  const navigate = useNavigate();
  const { mutate, isPending, data } = useRegisterMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    packageName: "",
    pricingId: 1,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: (res) => {
        console.log({ res });
        console.log("registration successful");
        // navigate("/login");
        // if (res && res.success) {
        //   navigate("/success?type=mentorship");
        // }
      },
    });
    // setFormData({
    //   fullName: "",
    //   email: "",
    //   phone: "",
    //   packageName: "",
    // });
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
          Register
        </motion.h1>

        <motion.p variants={headingVariant}>
          Register here to create your account and get started.
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

          {/* Password */}
          <motion.div className="form-group" variants={fieldVariant}>
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </motion.div>

          {/* end password */}

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

          {/* Pricing */}
          <motion.div className="form-group" variants={fieldVariant}>
            <label htmlFor="pricing">Select Pricing Package*</label>
            <select
              id="pricingId"
              value={formData.pricingId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Choose a package
              </option>
              {pricingOptions.map((price) => (
                <option key={price.id} value={price.id}>
                  {price.title}
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

export default Register;
