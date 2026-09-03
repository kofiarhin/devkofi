import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useLogoutAdmin from '../../hooks/mutations/useLogoutAdmin';
import s from './AdminShell.module.scss';

const items = [
  ['Overview', '/admin/dashboard'], ['Articles', '/admin/articles'], ['Bookings', '/admin/bookings'],
  ['Messages', '/admin/messages'], ['Subscribers', '/admin/subscribers'], ['Settings', '/admin/settings'],
];

const AdminShell = () => {
  const admin = useSelector((state) => state.auth.admin);
  const { mutate: logout, isPending } = useLogoutAdmin();
  return <div className={s.shell}>
    <aside className={s.sidebar}>
      <NavLink to="/admin/dashboard" className={s.brand}>DevKofi <span>Admin</span></NavLink>
      <nav aria-label="Admin navigation" className={s.nav}>
        {items.map(([label, to]) => <NavLink key={to} to={to} className={({ isActive }) => `${s.link} ${isActive ? s.active : ''}`}>{label}</NavLink>)}
      </nav>
      <div className={s.account}><small>Signed in as</small><span>{admin?.email}</span><button type="button" onClick={() => logout()} disabled={isPending}>{isPending ? 'Signing out…' : 'Sign out'}</button></div>
    </aside>
    <main className={s.content}><Outlet /></main>
  </div>;
};

export default AdminShell;
