import { useState } from "react";
import "./register.styles.scss";
import { useNavigate } from "react-router-dom";
import useRegisterMutation from "../../hooks/useRegisterMuation";

const Register = () => {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useRegisterMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { firstName, lastName, email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(
      { firstName, lastName, email, password },
      {
        onSuccess: () => navigate("/login"),
      },
    );
  };

  return (
    <div id="register">
      <h1 className="heading center">Register</h1>

      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter first name..."
              name="firstName"
              value={firstName}
              onChange={handleChange}
              autoComplete="given-name"
            />
          </div>

          <div className="input-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Enter last name..."
              name="lastName"
              value={lastName}
              onChange={handleChange}
              autoComplete="family-name"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              placeholder="Enter email address..."
              name="email"
              value={email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password..."
              name="password"
              value={password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p style={{ color: "#ff6b6b", marginTop: 10 }}>
              {error.message || "Registration failed."}
            </p>
          )}

          <div className="button-wrapper">
            <button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
