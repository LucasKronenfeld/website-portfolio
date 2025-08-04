// src/Blog.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Initialize Firestore
const db = getFirestore();

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
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
              {post.createdAt && (
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