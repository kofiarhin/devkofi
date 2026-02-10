import { FaTimes } from "react-icons/fa";
import { toggleSideNav } from "../../redux/navigation/navigationSlice";
import { logoutUser } from "../../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./sideNav.styles.scss";

const SideNav = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const closeNav = () => dispatch(toggleSideNav());

  const handleLogout = () => {
    dispatch(logoutUser());
    closeNav();
  };

  return (
    <div id="sideNav">
      <FaTimes onClick={closeNav} className="close-icon" />

      <div className="nav-content">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink
              to="/"
              onClick={closeNav}
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              Home
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/about"
              onClick={closeNav}
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              About
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/projects"
              onClick={closeNav}
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              Projects
            </NavLink>
          </li>

          {user ? (
            <>
              <li className="nav-item">
                <NavLink
                  to="/dashboard"
                  onClick={closeNav}
                  className={({ isActive }) =>
                    isActive ? "active-link" : "nav-link"
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink
                  to="/login"
                  onClick={closeNav}
                  className={({ isActive }) =>
                    isActive ? "active-link" : "nav-link"
                  }
                >
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/register"
                  onClick={closeNav}
                  className={({ isActive }) =>
                    isActive ? "active-link" : "nav-link"
                  }
                >
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
