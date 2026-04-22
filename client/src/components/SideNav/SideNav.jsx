import { FaTimes } from "react-icons/fa";
import { toggleSideNav } from "../../redux/navigation/navigationSlice";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import "./sideNav.styles.scss";

const SideNav = () => {
  const dispatch = useDispatch();

  const closeNav = () => dispatch(toggleSideNav());

  const navLinkClass = ({ isActive }) => (isActive ? "active-link" : "nav-link");

  return (
    <div id="sideNav">
      <FaTimes onClick={closeNav} className="close-icon" />

      <div className="nav-content">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/" onClick={closeNav} className={navLinkClass}>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" onClick={closeNav} className={navLinkClass}>
              About
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/projects" onClick={closeNav} className={navLinkClass}>
              Projects
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/contact" onClick={closeNav} className={navLinkClass}>
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
