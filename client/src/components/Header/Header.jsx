import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./header.styles.scss";
import { logoutUser } from "../../redux/auth/authSlice";
import { FaBars, FaTimes } from "react-icons/fa";
import { toggleSideNav } from "../../redux/navigation/navigationSlice";

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  const dispath = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispath(logoutUser());
  };
  return (
    <header className="main-header">
      <div className="container">
        <Link>
          <h1 className="logo">DevKofi</h1>
        </Link>

        <nav>
          <FaBars className="menu" onClick={() => dispath(toggleSideNav())} />
          <Link to="/">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Regiser</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
