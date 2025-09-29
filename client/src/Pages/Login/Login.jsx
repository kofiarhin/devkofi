import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import useLoginMutation from "../../hooks/useLoginMutation";
import { motion } from "framer-motion";
import "./login.styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/auth/authSlice";

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

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mutate, isPending, error, isSuccess, data } = useLoginMutation();
  const [formData, setFormData] = useState({
    email: "test@gmail.com",
    password: "password",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData, {
      onError: (data) => {
        // console.log("error", data.message);
      },
      onSuccess: (data) => {
        const userPayload = data?.user
          ? { token: data.token, ...data.user }
          : null;

        dispatch(setUser(userPayload));

        if (userPayload) {
          localStorage.setItem("user", JSON.stringify(userPayload));
        } else {
          localStorage.removeItem("user");
        }

        setFormData({
          email: "",
          password: "",
        });
        navigate("/portal");
      },
    });
  };

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
          Login
        </motion.h1>

        <motion.p variants={headingVariant}>
          Sign in with your email and password to continue
        </motion.p>

        {/* Form */}
        <motion.form className="form" onSubmit={handleSubmit}>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </motion.div>

          {error && <p className="text-error"> {error.message} </p>}

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

export default Login;
