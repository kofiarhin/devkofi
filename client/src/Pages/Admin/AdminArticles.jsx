import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminArticles, useArticleTransition } from '../../hooks/useAdminData';
import s from './Admin.module.scss';

const AdminArticles = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 20, search: '', status: 'all' });
  const { data, isLoading, isError } = useAdminArticles(filters);
  const transition = useArticleTransition();
  const result = data?.data?.data || {};
  const act = (article, action) => {
    if ((action === 'archive' || action === 'restore') && !window.confirm(`${action === 'archive' ? 'Archive' : 'Restore'} “${article.title}”?`)) return;
    transition.mutate({ id: article._id, action });
  };
  return <section className={s.page}>
    <header className={s.header}><div><h1>Articles</h1><p>Draft, publish, and maintain DevKofi articles.</p></div><Link className={s.primary} to="/admin/articles/new">New article</Link></header>
    <div className={s.toolbar}><input className={s.input} aria-label="Search articles" placeholder="Search articles" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}/><select className={s.select} aria-label="Article status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}><option value="all">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></div>
    {isLoading ? <p>Loading articles…</p> : isError ? <p className={s.error} role="alert">Could not load articles.</p> : !result.items?.length ? <p className={s.card}>No articles match these filters.</p> : <div className={s.tableWrap}><table className={s.table}><thead><tr><th>Article</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead><tbody>{result.items.map((article) => <tr key={article._id}><td><strong>{article.title}</strong><div className={s.muted}>/{article.slug}</div></td><td><span className={s.status}>{article.status}</span></td><td>{new Date(article.updatedAt).toLocaleDateString()}</td><td><div className={s.actions}>{article.status !== 'archived' && <Link className={s.button} to={`/admin/articles/${article._id}/edit`}>Edit</Link>}{article.status === 'draft' && <button className={s.primary} onClick={() => act(article, 'publish')}>Publish</button>}{article.status === 'published' && <button className={s.button} onClick={() => act(article, 'unpublish')}>Unpublish</button>}{article.status !== 'archived' ? <button className={s.danger} onClick={() => act(article, 'archive')}>Archive</button> : <button className={s.button} onClick={() => act(article, 'restore')}>Restore</button>}</div></td></tr>)}</tbody></table></div>}
    <div className={s.pagination}><span>Page {result.page || 1} of {result.totalPages || 1}</span><div className={s.actions}><button className={s.button} disabled={(result.page || 1) <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Previous</button><button className={s.button} disabled={(result.page || 1) >= (result.totalPages || 1)} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</button></div></div>
  </section>;
};
export default AdminArticles;
