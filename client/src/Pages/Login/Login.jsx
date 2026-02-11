import { useState } from "react";
import useLoginMutation from "../../hooks/useLoginMutation";
import "./login.styles.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const redirectTo = location?.state?.from || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const { mutate, isPending, error } = useLoginMutation();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem("user", JSON.stringify(data));
          dispatch(setUser(data));
          navigate(redirectTo, { replace: true });
        },
      },
    );
  };

  return (
    <div id="login">
      <h1 className="heading center">Login</h1>

      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
              value={email}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
              value={password}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p style={{ color: "#ff6b6b", marginTop: 10 }}>
              {error.message || "Login failed."}
            </p>
          )}

          <div className="button-wrapper">
            <button type="submit" disabled={isPending}>
              {isPending ? "Logging in..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
