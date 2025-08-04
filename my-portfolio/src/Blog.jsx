// src/Blog.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Import the db instance

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
        // Optionally, set an error state here to show in the UI
      }
    };

    fetchPosts();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <div className="space-y-6">
        {posts.map((post) => {
          return (
            <div key={post.id}>
              <Link to={`/blog/${post.id}`} className="text-2xl font-semibold text-primary hover:underline">
                {post.title}
              </Link>
              {post.createdAt && post.createdAt.toDate && (
                <p className="text-sm text-text-secondary mt-1">
                  Published on: {new Date(post.createdAt.toDate()).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}