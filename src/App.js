// src/App.js

import React from 'react';
import { HashRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import BlogFeed from './blog/BlogFeed';
import BlogPost from './blog/BlogPost';

function App() {
  return (
    <Router>
      <div className="container">
        <header className="header">
          <div className="logo">Matt Neave</div>
          <div className="social-links">
            <a href="https://github.com/matt-neave" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/matt-neave/" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://twitter.com/mattneave" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostView />} />
          </Routes>
        </main>
		<footer className="footer">
  			© {new Date().getFullYear()} Matt Neave. All rights reserved.
		</footer>

      </div>
    </Router>
  );
}

function Home() {
  const navigate = useNavigate();

  const handleSelectPost = (post) => {
    navigate(`/post/${post.id}`);
  };

  return (
    <>
      <h1 className="title">Matt Neave — Software Engineer</h1>
      <p className="description">
        Matt Neave is a software engineer based in London. He graduated from Imperial College London in 2024 with a Master's degree in Computing.
      </p>
      <div id="blog-feed">
        <BlogFeed onSelectPost={handleSelectPost} />
      </div>
    </>
  );
}

function PostView() {
  const navigate = useNavigate();

  return (
    <>
      <BlogPost />
    </>
  );
}

export default App;
