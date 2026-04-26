import { FaTimes } from "react-icons/fa";
import { closeSideNav } from "../../redux/navigation/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import useLogoutAdmin from "../../hooks/mutations/useLogoutAdmin";
import {
  adminNavItems,
  publicActionItem,
  publicNavItems,
} from "../../constants/navigation";
import "./sideNav.styles.scss";

const SideNav = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const admin = useSelector((state) => state.auth.admin);
  const { mutate: logout, isPending: isLoggingOut } = useLogoutAdmin();

  const closeNav = () => dispatch(closeSideNav());

  const navLinkClass = ({ isActive }) => (isActive ? "active-link" : "nav-link");
  const adminNavLinkClass = (item) => {
    const isExcluded = item.excludePrefixes?.some((prefix) =>
      pathname.startsWith(prefix)
    );
    const isActive =
      !isExcluded &&
      (pathname === item.to ||
        (item.matchPrefix && pathname.startsWith(item.matchPrefix)));

    return isActive ? "active-link" : "nav-link";
  };

  const handleLogout = () => {
    closeNav();
    logout();
  };

  return (
    <div id="sideNav" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <button type="button" onClick={closeNav} className="close-button" aria-label="Close navigation">
        <FaTimes className="close-icon" aria-hidden="true" />
      </button>

      <nav className="nav-content" aria-label="Mobile navigation">
        <ul className="nav-list">
          {publicNavItems.map((item) => (
            <li className="nav-item" key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                onClick={closeNav}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            </li>
          ))}

          {admin &&
            adminNavItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={closeNav}
                  className={() => adminNavLinkClass(item)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}

          <li className="nav-item">
            <NavLink to={publicActionItem.to} onClick={closeNav} className={navLinkClass}>
              {publicActionItem.label}
            </NavLink>
          </li>

          {admin && (
            <li className="nav-item">
              <button
                type="button"
                onClick={handleLogout}
                className="logout-btn"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default SideNav;
