import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Card from './components/Card';

export default function Portfolio() {
  const [portfolioData, setPortfolioData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const docRef = doc(db, 'portfolio', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          const data = docSnap.data();
          setPortfolioData(data);
          setActiveCategory(Object.keys(data)[0]); // Set initial category
        } else {
          console.log("No portfolio data found in the database.");
        }
      } catch (error) {
        console.error("Error fetching portfolio data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolioData();
  }, []);
  
  const categories = Object.keys(portfolioData);
  const artworks = activeCategory ? portfolioData[activeCategory] : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading Portfolio...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-text">My Portfolio</h1>

      {/* --- Category Navigation --- */}
      <div className="flex justify-center gap-4 mb-12">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full font-semibold transition ${activeCategory === category ? 'bg-secondary text-white' : 'bg-contrast text-white hover:bg-darkback'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* --- Artworks Grid --- */}
      <motion.div 
        key={activeCategory} // This forces re-render with animation on category change
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {artworks.map((art, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              title={art.title}
              description={art.description}
              imageUrl={art.imageUrl}
              link={art.link} // Assuming you might add links later
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
