// src/blog/BlogFeed.js

import React, { useState, useEffect } from 'react';
import BlogList from './BlogList';
import BlogPost from './BlogPost';
import { parseMetadata } from './metadataParser'; // Import a utility to parse metadata

const BlogFeed = ({ onSelectPost }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      const postFiles = [
        'post1.md',
        'post2.md',
        'post3.md',
        'post4.md',
      ];
	  const basePath = process.env.PUBLIC_URL || '';

	  const loadedPosts = await Promise.all(
		postFiles.map(async (file, index) => {
		  const path = `${basePath}/posts/${file}`; // Include base URL in path
		  const response = await fetch(path);
		  if (!response.ok) {
			throw new Error(`Could not fetch the file: ${path}`);
		  }
		  const text = await response.text();
		  // Extract metadata and content
		  const { title, date, author, content } = parseMetadata(text);
	  
		  return {
			id: index + 1, // Use index or a unique identifier
			title,
			date,
			author,
			content,
		  };
		})
	  );

      // Sort posts by date in descending order
      loadedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(loadedPosts);
    };

    loadPosts();
  }, []);

  return (
    <div className="blog-feed">
      <h2>Read more from Matt Neave</h2>
	  <img src="images/logo512.png" />
      <BlogList posts={posts} onSelectPost={onSelectPost} />
    </div>
  );
};

export default BlogFeed;
