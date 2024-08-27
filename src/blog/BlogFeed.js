import React, { useState, useEffect } from 'react';
import BlogList from './BlogList';
import BlogPost from './BlogPost';
import { parseMetadata } from './metadataParser'; // Import a utility to parse metadata

const BlogFeed = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

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

          // Extract metadata and content
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

      // Sort posts by date in descending order
      loadedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(loadedPosts);
    };

    loadPosts();
  }, []);

  const handleSelectPost = (index) => {
    setSelectedPostIndex(index);
  };

  const handleBackToList = () => {
    setSelectedPostIndex(null);
  };

  return (
    <div className="blog-feed">
	  <h2>Read more from Matt Neave</h2>
      {selectedPostIndex === null ? (
        <BlogList posts={posts} onSelectPost={handleSelectPost} />
      ) : (
        <>
          <button className="back-button" onClick={handleBackToList}>Back to list</button>
          <BlogPost content={posts[selectedPostIndex].content} />
        </>
      )}
    </div>
  );
};

export default BlogFeed;
