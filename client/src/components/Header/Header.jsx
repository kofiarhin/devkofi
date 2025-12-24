import "./header.styles.scss";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/auth/authSlice";
import { FaBars } from "react-icons/fa";
import { toggleSideNav } from "../../redux/navigation/navigationSlice";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="main-header">
      <div className="container header-content">
        <Link to="/" className="logo-container">
          <h1 className="logo">
            Dev<span>Kofi</span>
          </h1>
        </Link>

        <nav className="nav-links">
          <Link to="/" className="nav-item">
            Home
          </Link>
          <Link to="/projects" className="nav-item">
            Projects
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-item">
                Dashboard
              </Link>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">
                Login
              </Link>
              <Link to="/register" className="btn-cta">
                Get Started
              </Link>
            </>
          )}
        </nav>

        <div className="mobile-actions">
          <FaBars
            className="menu-icon"
            onClick={() => dispatch(toggleSideNav())}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
