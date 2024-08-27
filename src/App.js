// src/App.js

import React from 'react';
import './App.css';
import BlogFeed from './BlogFeed';

function App() {
  return (
    <div className="container">
      <header className="header">
        <div className="logo">Matt Neave</div>
        {/* <button className="contact-button">Contact</button> */}
      </header>
      <main className="main-content">
        <h1 className="title">
          Software Engineer
        </h1>
        <p className="description">
          I'm Matt Neave, a software engineer based in London. I graduated from Imperial College London in 2024 with a Master's degree in Computing.
        </p>
        <BlogFeed />
      </main>
    </div>
  );
}

export default App;
