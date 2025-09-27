import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './blog.styles.scss'

const BlogPost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [md, setMd] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const manifest = await (await fetch('/blog/posts.json')).json()
        const meta = (manifest || []).find(p => p.slug === slug && p.published)
        setPost(meta || null)
        if (meta?.file) {
          const raw = await (await fetch(meta.file)).text()
          setMd(raw)
        }
      } catch {
        setPost(null)
      }
    }
    load()
  }, [slug])

  if (!post) {
    return (
      <section className="post">
        <p>Post not found. <Link to="/blog">Back to blog</Link></p>
      </section>
    )
  }

  return (
    <article className="post">
      <p><Link to="/blog">← Back</Link></p>
      <h1>{post.title}</h1>
      <p className="meta">{new Date(post.date).toDateString()} · {(post.tags || []).join(', ')}</p>
      {post.cover && <img src={post.cover} alt="" />}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
    </article>
  )
}
export default BlogPost
