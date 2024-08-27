// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import BlogFeed from './blog/BlogFeed';
import BlogPost from './blog/BlogPost';

function App() {
  return (
    <Router basename='personalSite'>
      <div className="container">
        <header className="header">
          <div className="logo">Matt Neave</div>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostView />} />
          </Routes>
        </main>
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
      <button className="back-button" onClick={() => navigate(-1)}>Back to list</button>
      <BlogPost />
    </>
  );
}

export default App;
