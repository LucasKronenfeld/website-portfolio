import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { motion } from 'framer-motion';

// --- Modal Component ---
const PostModal = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
        <p className="text-sm text-gray-500 mb-6">
          Published on: {new Date(post.createdAt.toDate()).toLocaleDateString()}
        </p>
        <div className="text-gray-800 whitespace-pre-wrap">
          {post.content}
        </div>
        <button 
          onClick={onClose} 
          className="mt-8 px-4 py-2 bg-secondary text-white rounded hover:bg-darkback"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

// --- Blog Page ---
export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
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

  const openModal = (post) => setSelectedPost(post);
  const closeModal = () => setSelectedPost(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
        className="container mx-auto px-4 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
    >
        <motion.h1 
            className="text-4xl font-bold text-center mb-12 text-text"
            variants={itemVariants}
        >
            Blog Posts
        </motion.h1>

        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
        >
            {posts.map((post) => (
            <motion.div 
                key={post.id} 
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col hover:shadow-xl transition-shadow"
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
            >
                <h2 className="text-2xl font-semibold text-primary mb-2">{post.title}</h2>
                {post.createdAt?.toDate && (
                <p className="text-sm text-text-secondary mb-4">
                    Published on: {new Date(post.createdAt.toDate()).toLocaleDateString()}
                </p>
                )}
                <p className="text-gray-700 flex-grow">
                {post.content.substring(0, 150)}{post.content.length > 150 ? "..." : ""}
                </p>
                <button 
                onClick={() => openModal(post)}
                className="mt-4 px-4 py-2 bg-primary text-white self-start rounded hover:bg-secondary transition-colors"
                >
                Read More
                </button>
            </motion.div>
            ))}
        </motion.div>
        
        {selectedPost && <PostModal post={selectedPost} onClose={closeModal} />}
    </motion.div>
  );
}
