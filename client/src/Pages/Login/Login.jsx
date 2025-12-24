import { useState } from "react";
import useLoginMutation from "../../hooks/useLoginMutation";
import "./login.styles.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const { mutate } = useLoginMutation();

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: (data) => {
        localStorage.setItem("user", JSON.stringify(data));
        dispatch(setUser(data));
        navigate("/dashboard");
      },
    });
  };
  return (
    <div id="login">
      <h1 className="heading center">Login</h1>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          {/* input-group */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
              value={email}
            />
          </div>
          {/* end input-group */}

          {/* input-group */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
              value={password}
            />
          </div>
          {/* end input-group */}

          <div className="button-wrapper">
            <button>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
