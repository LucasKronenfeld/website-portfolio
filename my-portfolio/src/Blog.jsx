import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- Blog Page ---
export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-text px-4">
      <div className="text-lg sm:text-xl font-semibold">Loading Blog...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background text-text pt-20 sm:pt-24">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-3 sm:mb-4">Blog</h1>
          <p className="text-base sm:text-lg text-muted max-w-3xl mx-auto px-4">
            Thoughts, stories, and updates from my journey in web development and design.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {posts.map((post) => (
            <motion.div 
              key={post.id} 
              className="bg-surface rounded-lg shadow-lg overflow-hidden flex flex-col border border-white/10 hover:border-primary/30 transition-colors cursor-pointer"
              variants={itemVariants}
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              {post.coverImage && (
                <div className="w-full h-40 sm:h-48 overflow-hidden">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h2 className="text-xl sm:text-2xl font-semibold text-text mb-2">{post.title}</h2>
                {post.createdAt?.toDate && (
                  <p className="text-xs sm:text-sm text-muted mb-3 sm:mb-4">
                    {new Date(post.createdAt.toDate()).toLocaleDateString()}
                  </p>
                )}
                <p className="text-sm sm:text-base text-muted flex-grow line-clamp-3">
                  {post.excerpt || post.content.substring(0, 150)}{(post.excerpt || post.content).length > 150 ? "..." : ""}
                </p>
                <button 
                  className="mt-4 px-4 py-2 bg-primary text-white self-start rounded-lg hover:bg-opacity-90 transition-colors text-sm sm:text-base"
                >
                  Read More
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
      </div>
    </div>
  );
}
