import { useEffect, useRef } from "react";
import { X } from "@phosphor-icons/react";
import { closeSideNav } from "../../redux/navigation/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import useLogoutAdmin from "../../hooks/mutations/useLogoutAdmin";
import { adminNavItems, publicActionItem, publicNavItems } from "../../constants/navigation";
import "./sideNav.styles.scss";

const SideNav = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const admin = useSelector((state) => state.auth.admin);
  const { mutate: logout, isPending: isLoggingOut } = useLogoutAdmin();
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  const closeNav = () => dispatch(closeSideNav());

  useEffect(() => {
    const previous = document.activeElement;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeNav();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, []);

  const navLinkClass = ({ isActive }) => (isActive ? "active-link" : "nav-link");
  const adminNavLinkClass = (item) => {
    const excluded = item.excludePrefixes?.some((prefix) => pathname.startsWith(prefix));
    const active = !excluded && (pathname === item.to || (item.matchPrefix && pathname.startsWith(item.matchPrefix)));
    return active ? "active-link" : "nav-link";
  };

  return (
    <div className="side-nav-overlay" onMouseDown={(event) => event.target === event.currentTarget && closeNav()}>
      <aside id="sideNav" ref={panelRef} role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div className="side-nav-header">
          <span className="side-nav-logo">Dev<span>Kofi</span></span>
          <button ref={closeButtonRef} type="button" onClick={closeNav} className="close-button" aria-label="Close navigation">
            <X size={24} weight="bold" aria-hidden="true" />
          </button>
        </div>

        <nav className="nav-content" aria-label="Mobile navigation">
          <ul className="nav-list">
            {publicNavItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === "/"} onClick={closeNav} className={navLinkClass}>{item.label}</NavLink>
              </li>
            ))}
            {admin && adminNavItems.map((item) => (
              <li key={item.to}><NavLink to={item.to} onClick={closeNav} className={() => adminNavLinkClass(item)}>{item.label}</NavLink></li>
            ))}
            <li><NavLink to={publicActionItem.to} onClick={closeNav} className="side-nav-cta">{publicActionItem.label}</NavLink></li>
            {admin && <li><button type="button" onClick={() => { closeNav(); logout(); }} className="logout-btn" disabled={isLoggingOut}>{isLoggingOut ? "Logging out..." : "Logout"}</button></li>}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default SideNav;
