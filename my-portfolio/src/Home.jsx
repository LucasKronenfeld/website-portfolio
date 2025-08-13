import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Hero from './components/Hero';
import GridItem from './components/GridItem';

const Home = () => {
  const [featuredContent, setFeaturedContent] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const docRef = doc(db, 'featured', 'home');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().items) {
        setFeaturedContent(docSnap.data().items);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-[#f5f5f7] text-gray-800 min-h-screen">
      <Hero />
      
      <div className="container mx-auto px-6 py-24" id="featured-work">
        <motion.h2 
          className="text-5xl font-bold text-center mb-16 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Featured Work
        </motion.h2>
        
        {featuredContent.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {featuredContent.map(item => (
              <motion.div 
                key={item.id} 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
              >
                <GridItem 
                  imageUrl={item.imageUrl}
                  title={item.title}
                  description={item.description}
                  link={item.link}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500">Loading featured work...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
