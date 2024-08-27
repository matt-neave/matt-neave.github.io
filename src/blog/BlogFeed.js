// src/blog/BlogFeed.js

import React, { useState, useEffect } from 'react';
import BlogList from './BlogList';
import BlogPost from './BlogPost';
import { parseMetadata } from './metadataParser';

const BlogFeed = ({ onSelectPost, selectedPost }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      const postFiles = [
        'post1.md',
        'post2.md',
        'post3.md',
        'post4.md',
      ];

      const loadedPosts = await Promise.all(
        postFiles.map(async (file) => {
          const response = await fetch(process.env.PUBLIC_URL + `/posts/${file}`);
          const text = await response.text();

          const { title, date, author, content } = parseMetadata(text);

          return {
            file,
            title,
            date,
            author,
            content,
          };
        })
      );

      loadedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(loadedPosts);
    };

    loadPosts();
  }, []);

  return (
    <div className="blog-feed">
      {selectedPost ? (
        <BlogPost content={selectedPost.content} />
      ) : (
        <BlogList posts={posts} onSelectPost={onSelectPost} />
      )}
    </div>
  );
};

export default BlogFeed;
