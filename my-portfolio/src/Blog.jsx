// src/Blog.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Import the db instance

// Modal Component
const PostModal = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose} // Close modal on overlay click
    >
      <div 
        className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
        <p className="text-sm text-gray-500 mb-6">
          Published on: {new Date(post.createdAt.toDate()).toLocaleDateString()}
        </p>
        {/* Use whitespace-pre-wrap to respect newlines in the content */}
        <div className="text-gray-800 whitespace-pre-wrap">
          {post.content}
        </div>
        <button 
          onClick={onClose} 
          className="mt-8 px-4 py-2 bg-secondary text-white rounded hover:bg-darkback"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Query to order posts by creation date, newest first
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(postsQuery);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <h2 className="text-2xl font-semibold text-primary mb-2">{post.title}</h2>
            {post.createdAt?.toDate && (
              <p className="text-sm text-text-secondary mb-4">
                Published on: {new Date(post.createdAt.toDate()).toLocaleDateString()}
              </p>
            )}
            <p className="text-gray-700 flex-grow">
              {/* Create a short snippet */}
              {post.content.substring(0, 150)}{post.content.length > 150 ? "..." : ""}
            </p>
            <button 
              onClick={() => openModal(post)}
              className="mt-4 px-4 py-2 bg-primary text-white self-start rounded hover:bg-secondary transition-colors"
            >
              Read More
            </button>
          </div>
        ))}
      </div>
      
      <PostModal post={selectedPost} onClose={closeModal} />
    </div>
  );
}
