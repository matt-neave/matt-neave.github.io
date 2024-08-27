import React from 'react';

const BlogList = ({ posts, onSelectPost }) => {
  return (
    <div className="blog-list">
      {posts.map((post, index) => (
        <div key={index} className="post-summary" onClick={() => onSelectPost(index)}>
          <h3>{post.title}</h3>
          <p>Date: {post.date}</p>
          <p>Author: {post.author}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
