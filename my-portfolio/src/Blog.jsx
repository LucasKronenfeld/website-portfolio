import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

// --- Modal Component ---
const PostModal = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[1000] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-surface p-8 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 relative"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-text transition-colors z-10 p-1 bg-surface/50 rounded-full"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold text-text mb-2 pr-8">{post.title}</h2>
        <p className="text-sm text-muted mb-6">
          Published on: {new Date(post.createdAt.toDate()).toLocaleDateString()}
        </p>
        <div className="prose prose-invert max-w-none text-text whitespace-pre-wrap">
          {post.content}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Blog Page ---
export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(postsQuery);
        const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const openModal = (post) => setSelectedPost(post);
  const closeModal = () => setSelectedPost(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-text">Loading Blog...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-text pt-24">
      <div className="container mx-auto px-6 py-12">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">Blog</h1>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            Thoughts, stories, and updates from my journey in web development and design.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {posts.map((post) => (
            <motion.div 
              key={post.id} 
              className="bg-surface rounded-lg shadow-lg p-6 flex flex-col border border-white/10"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-semibold text-text mb-2">{post.title}</h2>
              {post.createdAt?.toDate && (
                <p className="text-sm text-muted mb-4">
                  {new Date(post.createdAt.toDate()).toLocaleDateString()}
                </p>
              )}
              <p className="text-muted flex-grow">
                {post.content.substring(0, 150)}{post.content.length > 150 ? "..." : ""}
              </p>
              <button 
                onClick={() => openModal(post)}
                className="mt-4 px-4 py-2 bg-primary text-white self-start rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Read More
              </button>
            </motion.div>
          ))}
        </motion.div>
        
        <AnimatePresence>
          {selectedPost && <PostModal post={selectedPost} onClose={closeModal} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
