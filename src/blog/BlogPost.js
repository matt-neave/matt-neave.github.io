import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ghcolors as codeStyling } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { parseMetadata } from './metadataParser';
import { Clipboard } from 'lucide-react';

const CopyButton = ({ text }) => {
	const [showToast, setShowToast] = useState(false);
  
	const copyToClipboard = () => {
	  navigator.clipboard.writeText(text);
	  setShowToast(true);
  
	  // Hide the toast after 2 seconds
	  setTimeout(() => setShowToast(false), 1900);
	};
  
	return (
	  <>
		<button className="copy-button" onClick={copyToClipboard}>
		  <Clipboard size={16} />
		</button>
  
		{showToast && <div className="toast-notification">Copied to clipboard!</div>}
	  </>
	);
};
  
  

const BlogPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadPost = async () => {
      try {
        const username = 'matt-neave';
        const repository = 'personalSite';
        const branch = 'main';
        const path = `https://raw.githubusercontent.com/${username}/${repository}/${branch}/public/posts/post${id}.md`;

        const response = await fetch(path);
        if (!response.ok) {
          throw new Error('Failed to load the post');
        }

        const text = await response.text();
        const { title, date, author, tags, content } = parseMetadata(text);
        setTitle(title);
        setDate(date);
        setAuthor(author);
        setTags(tags);
        setContent(content);
      } catch (error) {
        console.error('Error loading post:', error);
      }
    };

    loadPost();
  }, [id]);

  const renderers = {
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');

      return !inline && match ? (
        <div style={{ position: 'relative' }}>
          <CopyButton text={codeString} />
          <SyntaxHighlighter style={codeStyling} language={match[1].toLowerCase()} PreTag="div" {...props}>
            {codeString}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    a: ({ href, children }) => (
      <a href={href} style={{ color: '#7bb0cc', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    img: ({ alt, src }) => (
      <img
        src={`../${src}`}
        alt={alt}
        style={{ maxWidth: '60%', height: 'auto', display: 'block', margin: 'auto' }}
      />
    ),
  };

  return (
    <div className="blog-post">
      <div className="blog-title">{title}</div>
      <button className="back-button" onClick={() => navigate("/")}>Back to list</button>
      <p>Date: {date} | Author: {author}</p>
      <div className="blog-tags">
        {tags.map((tag, index) => (
          <span key={index} className="tag-label">{tag}</span>
        ))}
      </div>
      <hr className="divide" />
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default BlogPost;
