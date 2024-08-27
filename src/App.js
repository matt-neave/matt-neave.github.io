// src/App.js

import React from 'react';
import './App.css';
import BlogFeed from './blog/BlogFeed';

function App() {
  // Function to handle scroll to the blog feed
  const scrollToBlogFeed = () => {
    document.getElementById('blog-feed').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">Matt Neave</div>
        {/* <button className="contact-button">Contact</button> */}
      </header>
      <main className="main-content">
        <h1 className="title">
          Matt Neave — Software Engineer
        </h1>
        <p className="description">
          Matt Neave is a software engineer based in London. He graduated from Imperial College London in 2024 with a Master's degree in Computing.
        </p>
        {/* <div className="divider"> */}
          {/* <button className="read-more-button" onClick={scrollToBlogFeed}>Read More</button> */}
        {/* </div> */}
        <div id="blog-feed">
          <BlogFeed />
        </div>
      </main>
    </div>
  );
}

export default App;
