import { useState } from 'react';
import { useAdminSubscribers, useDeleteSubscriber } from '../../hooks/useAdminData';
import { exportNewsletterSubscribersCsv, exportNewsletterSubscribersJson } from '../../services/adminService';
import downloadFile, { getFilenameFromDisposition } from '../../utils/downloadFile';
import s from './Admin.module.scss';

const AdminSubscribers = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 20, search: '', verified: 'all' });
  const { data, isLoading, isError } = useAdminSubscribers(filters); const remove = useDeleteSubscriber(); const result = data?.data?.data || {};
  const exportList = async (format) => { const response = await (format === 'csv' ? exportNewsletterSubscribersCsv() : exportNewsletterSubscribersJson()); downloadFile({ blob: response.data, filename: getFilenameFromDisposition(response.headers?.['content-disposition'], `newsletter-subscribers.${format}`) }); };
  const removeItem = (item) => { if (window.confirm(`Remove ${item.email} from the newsletter?`)) remove.mutate(item._id); };
  return <section className={s.page}><header className={s.header}><div><h1>Subscribers</h1><p>Search, export, and remove newsletter subscribers.</p></div><div className={s.actions}><button className={s.button} onClick={() => exportList('csv')}>Export CSV</button><button className={s.button} onClick={() => exportList('json')}>Export JSON</button></div></header><div className={s.toolbar}><input className={s.input} aria-label="Search subscribers" placeholder="Search email" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}/><select className={s.select} aria-label="Verification state" value={filters.verified} onChange={(e) => setFilters({ ...filters, verified: e.target.value, page: 1 })}><option value="all">All</option><option value="true">Verified</option><option value="false">Unverified</option></select></div>{isLoading ? <p>Loading subscribers…</p> : isError ? <p className={s.error}>Could not load subscribers.</p> : !result.items?.length ? <p className={s.card}>No subscribers match these filters.</p> : <div className={s.tableWrap}><table className={s.table}><thead><tr><th>Email</th><th>Status</th><th>Subscribed</th><th>Action</th></tr></thead><tbody>{result.items.map((item) => <tr key={item._id}><td>{item.email}</td><td><span className={s.status}>{item.verified ? 'verified' : 'unverified'}</span></td><td>{new Date(item.createdAt).toLocaleDateString()}</td><td><button className={s.danger} disabled={remove.isPending} onClick={() => removeItem(item)}>Remove</button></td></tr>)}</tbody></table></div>}</section>;
};
export default AdminSubscribers;
