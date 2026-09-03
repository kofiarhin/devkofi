import { useAdminOverview } from '../../hooks/useAdminData';
import s from './Admin.module.scss';

const AdminOverview = () => {
  const { data, isLoading, isError, refetch } = useAdminOverview();
  const overview = data?.data?.data;
  if (isLoading) return <p>Loading overview…</p>;
  if (isError) return <div className={s.error} role="alert">Could not load the dashboard. <button onClick={() => refetch()}>Retry</button></div>;
  const cards = [
    ['Articles', overview?.articles?.total, `${overview?.articles?.published || 0} published · ${overview?.articles?.draft || 0} drafts`],
    ['Bookings', overview?.bookings?.total, `${overview?.bookings?.upcoming || 0} upcoming`],
    ['Messages', overview?.messages?.total, `${overview?.messages?.unread || 0} unread`],
    ['Subscribers', overview?.subscribers?.total, `${overview?.subscribers?.verified || 0} verified`],
  ];
  return <section className={s.page}>
    <header className={s.header}><div><h1>Overview</h1><p>What is happening across DevKofi.</p></div></header>
    <div className={s.metrics}>{cards.map(([label, value, detail]) => <article className={s.card} key={label}><span className={s.metricLabel}>{label}</span><strong className={s.metricValue}>{value || 0}</strong><small className={s.muted}>{detail}</small></article>)}</div>
    <section className={`${s.card} ${s.section}`}><h2>Recent activity</h2>{overview?.recentActivity?.length ? <ul className={s.activity}>{overview.recentActivity.map((item) => <li key={`${item.type}-${item.id}`}><span className={s.status}>{item.type}</span><span>{item.label} <small className={s.muted}>· {item.status}</small></span><time>{new Date(item.at).toLocaleDateString()}</time></li>)}</ul> : <p className={s.muted}>No recent activity.</p>}</section>
  </section>;
};
export default AdminOverview;
