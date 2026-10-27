import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseMetadata } from '../../blog/metadataParser';
import useStudioTab from '../useStudioTab';
import posts from './posts';
import './OagBlog.css';

async function fetchPost(slug) {
  const response = await fetch(`oag-posts/${slug}.md`);
  if (!response.ok) throw new Error(`Could not fetch post: ${slug}`);
  return { slug, ...parseMetadata(await response.text()) };
}

const formatDate = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

// First paragraph of the body as plain text, for the post list.
function excerpt(content, max = 160) {
  const para = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block && !/^(#|>|!\[|```|[-*] |\d+\. )/.test(block));
  if (!para) return '';
  const text = para
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ');
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

// The pixel fonts only look sharp when each font pixel covers a whole number of
// screen pixels. With Windows display scaling (e.g. 125%) a CSS pixel isn't one
// screen pixel, so the CSS snaps sizes and edges using this ratio.
function usePixelScale() {
  const [dpr, setDpr] = useState(() => window.devicePixelRatio || 1);
  useEffect(() => {
    // Browser zoom and moving between monitors change the ratio.
    const onResize = () => setDpr(window.devicePixelRatio || 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return { '--oagb-dpr': dpr };
}

function BlogFooter() {
  return (
    <footer className="oagb-footer">
      <p>&copy; {new Date().getFullYear()} Orange Acorn Games</p>
      <p>
        Fonts: BoldPixels by YukiPixels (CC BY-SA 4.0), Pixellari by Zacchary
        Dempsey-Plante
      </p>
    </footer>
  );
}

export function OagBlogIndex() {
  const [entries, setEntries] = useState(null);
  const [failed, setFailed] = useState(false);
  useStudioTab('Blog');

  useEffect(() => {
    Promise.all(posts.map(fetchPost))
      .then((loaded) => setEntries(loaded.sort((a, b) => new Date(b.date) - new Date(a.date))))
      .catch(() => setFailed(true));
  }, []);

  return (
    <div className="oagb-page" style={usePixelScale()}>
      <div className="oagb-column">
        <nav className="oagb-nav">
          <Link to="/orange-acorn-games" className="oagb-back">&lt; Orange Acorn Games</Link>
        </nav>

        <h1 className="oagb-heading">Blog</h1>

        {failed && <p className="oagb-status">Couldn't load posts.</p>}
        {!entries && !failed && <p className="oagb-status">Loading…</p>}

        {entries && (
          <ol className="oagb-list">
            {entries.map((post) => (
              <li key={post.slug}>
                <Link to={`/orange-acorn-games/blog/${post.slug}`} className="oagb-entry">
                  <span className="oagb-date">{formatDate(post.date)}</span>
                  <span className="oagb-entry-title">{post.title}</span>
                  <span className="oagb-entry-excerpt">{excerpt(post.content)}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}

        <BlogFooter />
      </div>
    </div>
  );
}

export function OagBlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [failed, setFailed] = useState(false);
  const pageStyle = usePixelScale();
  useStudioTab(post ? post.title : 'Blog');

  useEffect(() => {
    window.scrollTo(0, 0);
    setPost(null);
    setFailed(false);
    fetchPost(slug).then(setPost).catch(() => setFailed(true));
  }, [slug]);

  return (
    <div className="oagb-page" style={pageStyle}>
      <nav className="oagb-nav oagb-measure">
        <Link to="/orange-acorn-games/blog" className="oagb-back">&lt; Blog</Link>
      </nav>

      {post && (
        // The title owns the first screen. It shares the body's left edge but
        // is free to run wider than the reading column.
        <header className="oagb-hero oagb-measure">
          <h1 className="oagb-post-title">{post.title}</h1>
          <p className="oagb-date">{formatDate(post.date)}</p>
        </header>
      )}

      <div className="oagb-column">
        {failed && <p className="oagb-status">Couldn't find that post.</p>}
        {!post && !failed && <p className="oagb-status">Loading…</p>}

        {post && (
          <article>
            <div className="oagb-prose">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => (
                    // eslint-disable-next-line jsx-a11y/anchor-has-content
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        )}

        <BlogFooter />
      </div>
    </div>
  );
}
