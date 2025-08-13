import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Hero from './components/Hero';
import GridItem from './components/GridItem';

const Home = () => {
  const [featuredContent, setFeaturedContent] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const docRef = doc(db, 'featured', 'home');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().items) {
          setFeaturedContent(docSnap.data().items);
        }
      } catch (err) {
        console.error("Error fetching featured content:", err);
        setError("Could not load featured work.");
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
        
        {error && <p className="text-center text-red-500">{error}</p>}

        {!error && featuredContent.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {featuredContent.map(item => (
              <GridItem 
                key={item.id} 
                imageUrl={item.imageUrl}
                title={item.title}
                description={item.description}
                link={item.link}
              />
            ))}
          </motion.div>
        ) : (
          !error && <p className="text-center text-gray-500">Loading featured work...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
