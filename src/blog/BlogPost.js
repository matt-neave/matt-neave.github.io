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
        const response = await fetch(`../posts/post${id}.md`);
        
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

  return (
    <div className="blog-post">
      <p>Date: {date} | Author: {author}</p>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default BlogPost;
