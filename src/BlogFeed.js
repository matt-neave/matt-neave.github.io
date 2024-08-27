// src/BlogFeed.js

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      const postFiles = [
        'post1.md',
        'post2.md',
        'post3.md',
      ];

      const loadedPosts = await Promise.all(
        postFiles.reverse().map(async (file) => {
          const response = await fetch(process.env.PUBLIC_URL + `/posts/${file}`);
          const text = await response.text();
          return { content: text };
        })
      );

      setPosts(loadedPosts);
    };

    loadPosts();
  }, []);

  return (
    <div className="blog-feed">
      {posts.map((post, index) => (
        <div key={index} className="post">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default BlogFeed;
