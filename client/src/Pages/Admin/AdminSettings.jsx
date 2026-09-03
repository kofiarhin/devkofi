import { useSelector } from 'react-redux';
import s from './Admin.module.scss';
const AdminSettings = () => { const admin = useSelector((state) => state.auth.admin); return <section className={s.page}><header className={s.header}><div><h1>Settings</h1><p>Your current administrator session.</p></div></header><div className={s.card}><h2>Account</h2><p><strong>Email</strong><br/><span className={s.muted}>{admin?.email}</span></p><p><strong>Role</strong><br/><span className={s.muted}>{admin?.role}</span></p><p className={s.muted}>Credential management is intentionally outside this foundation.</p></div></section>; };
export default AdminSettings;
