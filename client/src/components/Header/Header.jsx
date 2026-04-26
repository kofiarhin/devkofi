import "./header.styles.scss";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaBars } from "react-icons/fa";
import { toggleSideNav } from "../../redux/navigation/navigationSlice";
import useLogoutAdmin from "../../hooks/mutations/useLogoutAdmin";
import {
  adminNavItems,
  publicActionItem,
  publicNavItems,
} from "../../constants/navigation";

const getNavLinkClass = ({ isActive }) =>
  isActive ? "nav-item active" : "nav-item";

const Header = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const admin = useSelector((state) => state.auth.admin);
  const { mutate: logout, isPending: isLoggingOut } = useLogoutAdmin();

  const getAdminLinkClass = (item) => {
    const isExcluded = item.excludePrefixes?.some((prefix) =>
      pathname.startsWith(prefix)
    );
    const isActive =
      !isExcluded &&
      (pathname === item.to ||
        (item.matchPrefix && pathname.startsWith(item.matchPrefix)));

    return isActive ? "btn-admin active" : "btn-admin";
  };

  return (
    <header className="main-header">
      <div className="container header-content">
        <Link to="/" className="logo-container">
          <h1 className="logo">
            Dev<span>Kofi</span>
          </h1>
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          {publicNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={getNavLinkClass}
            >
              {item.label}
            </NavLink>
          ))}

          {admin &&
            adminNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={() => getAdminLinkClass(item)}
              >
                {item.label}
              </NavLink>
            ))}

          <NavLink to={publicActionItem.to} className="btn-cta">
            {publicActionItem.label}
          </NavLink>

          {admin && (
            <button
              type="button"
              className="btn-logout"
              onClick={() => logout()}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          )}
        </nav>

        <div className="mobile-actions">
          <button
            type="button"
            className="menu-button"
            aria-label="Open navigation"
            onClick={() => dispatch(toggleSideNav())}
          >
            <FaBars className="menu-icon" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
