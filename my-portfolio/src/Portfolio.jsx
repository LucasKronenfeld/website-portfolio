import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Card from "./components/Card";

export default function Portfolio() {
  const [portfolioData, setPortfolioData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const docRef = doc(db, 'portfolio', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          const data = docSnap.data();
          setPortfolioData(data);
          setActiveTab(Object.keys(data)[0]); // Set initial tab
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
  const activeArtworks = activeTab ? portfolioData[activeTab] : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">Loading Portfolio...</div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background rounded-lg p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-screen-2xl mx-auto p-4 relative">
        <motion.h1 
          className="text-4xl font-bold text-text text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Portfolio
        </motion.h1>

        <motion.p 
          className="text-text text-lg mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Welcome to my art portfolio! Here you’ll find a collection of my creative work, including pixel art, digital illustrations, and photography. 
          Explore the different categories using the tabs below.
        </motion.p>

        <motion.div 
          className="relative w-full flex border-4 border-contrast border-b-0 rounded-t-lg bg-contrast"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {categories.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition relative rounded-t-lg 
                before:absolute before:bottom-0 before:left-0 before:w-full before:h-1 
                ${
                  activeTab === tab 
                    ? "bg-background text-text before:bg-secondary border-b-0 rounded-b-none" 
                    : "bg-contrast text-white before:bg-transparent"
                }`}
              whileHover={{ scale: 1.05 }}
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>

        <motion.div 
          className="border-4 border-contrast border-t-0 rounded-b-lg p-4 bg-background"
          key={activeTab}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {activeArtworks.map((art, index) => (
              <motion.div key={index} whileHover={{ scale: 1.05 }}>
                <Card imageSrc={art.imageUrl} title={art.title} description={art.description} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
