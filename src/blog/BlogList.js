import React, { useState } from 'react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState('All');
  const postsPerPage = 3;

  // Extract unique tags from posts
  const allTags = ['All', ...new Set(posts.flatMap(post => post.tags))];

  // Filter posts by the selected tag
  const filteredPosts = selectedTag === 'All' ? posts : posts.filter(post => post.tags.includes(selectedTag));

  // Calculate total pages based on filtered posts
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Get current posts for the active page
  const getCurrentPosts = () => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  };

  // Change page handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle tag selection
  const handleTagChange = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1); // Reset to the first page when the tag changes
  };

  return (
    <div>
      {/* Tag Filter Dropdown */}
      <div className="filter-container">
        <label htmlFor="tag-filter">Filter by tag:</label>
        <select id="tag-filter" value={selectedTag} onChange={(e) => handleTagChange(e.target.value)}>
          {allTags.map((tag, index) => (
            <option key={index} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className="blog-list">
        {getCurrentPosts().map((post, index) => (
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

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, pageIndex) => (
          <button
            key={pageIndex}
            className={`page-button ${currentPage === pageIndex + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(pageIndex + 1)}
          >
            {pageIndex + 1}
          </button>
        ))}

        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogList;
