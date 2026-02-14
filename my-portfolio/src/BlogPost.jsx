import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-text px-4">
        <div className="text-lg sm:text-xl font-semibold">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-text px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Post not found</h2>
          <button
            onClick={() => navigate('/blog')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition text-sm sm:text-base"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-background text-text"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-muted hover:text-text transition-colors mb-6 sm:mb-8 group"
        >
          <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base">Back to Blog</span>
        </button>

        {/* Cover Image */}
        {post.coverImage && (
          <motion.div
            className="w-full mb-6 sm:mb-8 rounded-lg overflow-hidden border border-white/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full max-h-[250px] sm:max-h-[350px] md:max-h-96 object-cover"
            />
          </motion.div>
        )}

        {/* Title and Date */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-3 sm:mb-4 leading-tight">
            {post.title}
          </h1>
          {post.createdAt?.toDate && (
            <p className="text-sm sm:text-base text-muted mb-6 sm:mb-8">
              Published on {new Date(post.createdAt.toDate()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </motion.div>

        {/* Content */}
        <motion.div
          className="prose prose-invert max-w-none text-text text-base sm:text-lg leading-relaxed whitespace-pre-wrap mb-8 sm:mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {post.content}
        </motion.div>

        {/* Gallery in Bento Box Style */}
        {post.galleryImages && post.galleryImages.length > 0 && (
          <motion.div
            className="mt-8 sm:mt-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-text mb-4 sm:mb-6">Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {post.galleryImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  className={`relative overflow-hidden rounded-lg border border-white/10 ${
                    idx === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover"
                    style={{ minHeight: idx === 0 ? '250px' : '120px' }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back Button at Bottom */}
        <motion.div
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-muted hover:text-primary transition-colors group text-sm sm:text-base"
          >
            <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to all posts</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
