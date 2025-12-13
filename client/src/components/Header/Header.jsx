import React from "react";
import { Link } from "react-router-dom";
import "./header.styles.scss";
const Header = () => {
  return (
    <header className="main-header">
      <div className="container">
        <Link>
          <h1>DevKofi</h1>
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Regiser</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
