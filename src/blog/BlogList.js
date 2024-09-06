import React from 'react';

// Function to check if a post is new (within 3 months)
const isNewPost = (date) => {
  const postDate = new Date(date);
  const currentDate = new Date();
  const threeMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
  return postDate > threeMonthsAgo && postDate <= new Date();
};

// Function to check if a post is coming soon (date is in the future)
const isComingSoon = (date) => {
  const postDate = new Date(date);
  const currentDate = new Date();
  return postDate > currentDate;
};

const BlogList = ({ posts, onSelectPost }) => {
  return (
    <div className="blog-list">
      {posts.map((post, index) => (
        <div key={index} className="post-summary" onClick={() => onSelectPost(post)}>
          <div className="post-header">
            <div className="tags-section">
              {(post.tags || []).map((tag, i) => (
                <span key={i} className="tag-label">{tag}</span>
              ))}
            </div>
            {isNewPost(post.date) && (
              <span className="new-label">New</span>
            )}
			{isComingSoon(post.date) && (
              <span className="soon-label">Coming Soon</span>
            )}
          </div>
          <h3>{post.title}</h3>
          <p>Date: {post.date}</p>
          <p>Author: {post.author}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
