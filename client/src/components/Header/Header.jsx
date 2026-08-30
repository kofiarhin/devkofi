import "./header.styles.scss";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { List } from "@phosphor-icons/react";
import { toggleSideNav } from "../../redux/navigation/navigationSlice";
import useLogoutAdmin from "../../hooks/mutations/useLogoutAdmin";
import { adminNavItems, publicActionItem, publicNavItems } from "../../constants/navigation";

const getNavLinkClass = ({ isActive }) => (isActive ? "nav-item active" : "nav-item");

const Header = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const admin = useSelector((state) => state.auth.admin);
  const isOpen = useSelector((state) => state.navigation.isOpen);
  const { mutate: logout, isPending: isLoggingOut } = useLogoutAdmin();

  const getAdminLinkClass = (item) => {
    const excluded = item.excludePrefixes?.some((prefix) => pathname.startsWith(prefix));
    const active = !excluded && (pathname === item.to || (item.matchPrefix && pathname.startsWith(item.matchPrefix)));
    return active ? "btn-admin active" : "btn-admin";
  };

  return (
    <header className="main-header">
      <div className="container header-content">
        <Link to="/" className="logo-container" aria-label="DevKofi home">
          <span className="logo">Dev<span>Kofi</span></span>
        </Link>

        <button
          type="button"
          className="menu-button"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          aria-controls="sideNav"
          onClick={() => dispatch(toggleSideNav())}
        >
          <List size={24} weight="bold" aria-hidden="true" />
        </button>

        <nav className="nav-links" aria-label="Primary navigation">
          {publicNavItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={getNavLinkClass}>
              {item.label}
            </NavLink>
          ))}

          {admin && adminNavItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={() => getAdminLinkClass(item)}>
              {item.label}
            </NavLink>
          ))}

          <NavLink to={publicActionItem.to} className="btn-cta">{publicActionItem.label}</NavLink>
          {admin && (
            <button type="button" className="btn-logout" onClick={() => logout()} disabled={isLoggingOut}>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
