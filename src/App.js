// src/App.js

import React, { useState } from 'react';
import './App.css';
import BlogFeed from './blog/BlogFeed';

function App() {
  const [selectedPost, setSelectedPost] = useState(null);

  const handleSelectPost = (post) => {
    setSelectedPost(post);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">Matt Neave</div>
      </header>
      <main className="main-content">
        {selectedPost === null ? (
          <>
            <h1 className="title">Matt Neave — Software Engineer</h1>
            <p className="description">
              Matt Neave is a software engineer based in London. He graduated from Imperial College London in 2024 with a Master's degree in Computing.
            </p>
            <div id="blog-feed">
              <BlogFeed onSelectPost={handleSelectPost} />
            </div>
          </>
        ) : (
          <div id="blog-post">
            <button className="back-button" onClick={handleBackToList}>Back to list</button>
            <h1 className="title">{selectedPost.title}</h1>
            <p className="description">
              Date: {selectedPost.date} | Author: {selectedPost.author}
            </p>
            <div id="blog-content">
              <BlogFeed selectedPost={selectedPost} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
