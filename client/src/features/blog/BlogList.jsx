import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './blog.styles.scss'

const BlogList = () => {
  const [posts, setPosts] = useState([])
  const [q, setQ] = useState('')

  useEffect(() => {
    fetch('/blog/posts.json')
      .then(r => r.json())
      .then(data => {
        const published = (data || [])
          .filter(p => p.published)
          .sort((a,b) => new Date(b.date) - new Date(a.date))
        setPosts(published)
      })
      .catch(() => setPosts([]))
  }, [])

  const filtered = useMemo(() => {
    if (!q.trim()) return posts
    const s = q.toLowerCase()
    return posts.filter(p =>
      (p.title || '').toLowerCase().includes(s) ||
      (p.excerpt || '').toLowerCase().includes(s) ||
      (p.tags || []).join(' ').toLowerCase().includes(s)
    )
  }, [q, posts])

  return (
    <section className="blog">
      <h1>Blog</h1>
      <input
        className="search"
        placeholder="Search posts…"
        value={q}
        onChange={e => setQ(e.target.value)}
        aria-label="Search blog posts"
      />
      <div className="blog__grid">
        {filtered.map(p => (
          <article className="card" key={p.slug}>
            {p.cover && <img src={p.cover} alt="" loading="lazy" />}
            <h3><Link to={`/blog/${p.slug}`}>{p.title}</Link></h3>
            <p className="meta">{new Date(p.date).toDateString()}</p>
            <p>{p.excerpt}</p>
            <p>{(p.tags || []).map(t => <span className="tag" key={t}>#{t} </span>)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
export default BlogList
