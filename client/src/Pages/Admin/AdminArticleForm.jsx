import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAdminArticle, useArticleTransition, useSaveAdminArticle } from '../../hooks/useAdminData';
import s from './Admin.module.scss';

const empty = { title: '', slug: '', excerpt: '', content: '', tags: '', coverImageUrl: '', coverImageAlt: '', seoTitle: '', seoDescription: '', status: 'draft' };
const AdminArticleEditor = ({ articleId, article }) => {
  const navigate = useNavigate();
  const initial = article ? { ...empty, ...article, tags: article.tags?.join(', ') || '', coverImageUrl: article.coverImageUrl || '', coverImageAlt: article.coverImageAlt || '' } : empty;
  const [form, setForm] = useState(initial); const [dirty, setDirty] = useState(false); const [preview, setPreview] = useState(false);
  const save = useSaveAdminArticle(articleId);
  const transition = useArticleTransition();
  useEffect(() => { const guard = (event) => { if (dirty) event.preventDefault(); }; window.addEventListener('beforeunload', guard); return () => window.removeEventListener('beforeunload', guard); }, [dirty]);
  const payload = useMemo(() => ({ ...form, tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean), sources: article?.sources || [], coverImageUrl: form.coverImageUrl || null, coverImageAlt: form.coverImageAlt || null }), [form, article]);
  const change = (key) => (event) => { setDirty(true); setForm({ ...form, [key]: event.target.value }); };
  const submit = async (event) => { event.preventDefault(); try { const response = await save.mutateAsync(payload); const id = response.data.data.article._id; if (event.nativeEvent.submitter?.value === 'publish') await transition.mutateAsync({ id, action: 'publish' }); setDirty(false); navigate(`/admin/articles/${id}/edit`, { replace: true }); } catch { /* rendered below */ } };
  return <section className={s.page}><header className={s.header}><div><h1>{articleId ? 'Edit article' : 'New article'}</h1><p>Write in Markdown and save as a draft.</p></div><button className={s.button} type="button" onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button></header>
    {preview ? <article className={s.card}><h1>{form.title || 'Untitled article'}</h1><p>{form.excerpt}</p><ReactMarkdown>{form.content}</ReactMarkdown></article> : <form className={s.form} onSubmit={submit}><div className={s.grid}><label className={s.field}>Title<input required maxLength="160" className={s.input} value={form.title} onChange={change('title')}/></label><label className={s.field}>Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" className={s.input} value={form.slug} onChange={change('slug')}/></label></div><label className={s.field}>Excerpt<textarea required maxLength="500" className={s.input} value={form.excerpt} onChange={change('excerpt')}/></label><label className={s.field}>Content (Markdown)<textarea required className={s.textarea} value={form.content} onChange={change('content')}/></label><label className={s.field}>Tags, separated by commas<input className={s.input} value={form.tags} onChange={change('tags')}/></label><div className={s.grid}><label className={s.field}>Cover image URL<input type="url" className={s.input} value={form.coverImageUrl} onChange={change('coverImageUrl')}/></label><label className={s.field}>Cover image alt text<input className={s.input} value={form.coverImageAlt} onChange={change('coverImageAlt')}/></label></div><div className={s.grid}><label className={s.field}>SEO title<input required maxLength="160" className={s.input} value={form.seoTitle} onChange={change('seoTitle')}/></label><label className={s.field}>SEO description<textarea required maxLength="320" className={s.input} value={form.seoDescription} onChange={change('seoDescription')}/></label></div>{(save.isError || transition.isError) && <div className={s.error} role="alert">{save.error?.response?.data?.error || transition.error?.response?.data?.error || 'Could not save article.'}</div>} {save.isSuccess && !transition.isError && <p className={s.success}>Article saved.</p>}<div className={s.actions}><button className={s.button} value="draft" disabled={save.isPending || transition.isPending}>{save.isPending ? 'Saving…' : 'Save draft'}</button><button className={s.primary} value="publish" disabled={save.isPending || transition.isPending}>Save &amp; publish</button><button className={s.button} type="button" onClick={() => { if (!dirty || window.confirm('Discard unsaved changes?')) navigate('/admin/articles'); }}>Back</button></div></form>}
  </section>;
};

const AdminArticleForm = () => {
  const { articleId } = useParams();
  const { data, isLoading, isError } = useAdminArticle(articleId);
  if (articleId && isLoading) return <p>Loading article…</p>;
  if (articleId && isError) return <p className={s.error}>Could not load the article.</p>;
  const article = data?.data?.data?.article;
  return <AdminArticleEditor key={article?._id || 'new'} articleId={articleId} article={article} />;
};
export default AdminArticleForm;
