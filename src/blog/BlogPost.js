import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseMetadata } from './metadataParser'; // Assuming you have a metadataParser utility

const BlogPost = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      try {
        // Fetch the markdown file based on the ID
        const username = 'matt-neave';
        const repository = 'personalSite';
        const branch = 'main';
        const path = `https://raw.githubusercontent.com/${username}/${repository}/${branch}/public/posts/post${id}.md`;

        const response = await fetch(path);
        if (!response.ok) {
          throw new Error('Failed to load the post');
        }

        const text = await response.text();

        // Extract metadata and content from the markdown file
        const { title, date, author, content } = parseMetadata(text);
        setTitle(title);
        setDate(date);
        setAuthor(author);
        setContent(content);
      } catch (error) {
        console.error('Error loading post:', error);
      }
    };

    loadPost();
  }, [id]); // Re-run this effect when the id changes

  // Helper function to embed Gist scripts dynamically
  const embedGist = (gistId) => {
	const gistScript = document.createElement('script');
	gistScript.src = `https://gist.github.com/matt-neave/${gistId}.js`;
	gistScript.async = true;
	gistScript.defer = true;
	document.body.appendChild(gistScript);
	};

  // Custom renderers for ReactMarkdown to handle images
  const renderers = {
	// Handle custom Gist syntax {gist: GIST_ID}
	p: ({ node, children }) => {
		const gistRegex = /{gist:\s*([a-zA-Z0-9]+)\s*}/;
		const match = children[0] && children[0].props && children[0].props.children[0].match(gistRegex);
		
		if (match) {
			const gistId = match[1];
			// Dynamically insert Gist script tag
			embedGist(gistId);
			// Return a placeholder where the Gist will be inserted
			return <div id={`gist-${gistId}`}>Loading Gist...</div>;
		}
	
		return <p>{children}</p>;
		},
	  
	// Custom image renderer for handling relative image paths
    img: ({ alt, src }) => {
      // If the image source is a relative path, convert it to an absolute URL
      const imageUrl = src.startsWith('./') 
        ? `./images/${src.slice(1)}`
        : src;

      return <img src={imageUrl} alt={alt} style={{ maxWidth: '100%', height: 'auto' }} />;
    },
  };

  return (
    <div className="blog-post">
      <h1>{title}</h1>
      <p>Date: {date} | Author: {author}</p>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={renderers} // Use custom renderers to handle images
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default BlogPost;
