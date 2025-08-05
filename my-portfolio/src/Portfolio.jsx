import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Card from "./components/Card";

export default function Portfolio() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const docRef = doc(db, 'portfolio', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPortfolioData(data);
          // Set the first category as active tab initially
          if (Object.keys(data).length > 0) {
            setActiveTab(Object.keys(data)[0]);
          }
        } else {
          console.log("No portfolio data found in the database.");
          setPortfolioData({});
        }
      } catch (error) {
        console.error("Error fetching portfolio data: ", error);
        setPortfolioData({});
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolioData();
  }, []);

  const categories = portfolioData ? Object.keys(portfolioData) : [];
  const activeArtworks = activeTab && portfolioData ? portfolioData[activeTab] : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-text">
        <div className="text-xl font-semibold">Loading Portfolio...</div>
      </div>
    );
  }
  
  if (categories.length === 0) {
    return (
       <div className="flex justify-center items-center min-h-screen bg-background text-text">
        <div className="text-xl font-semibold text-center">
            <p>No portfolio items could be loaded.</p>
            <p className="text-sm text-muted">Please check the admin dashboard to add some.</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="min-h-screen bg-background pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6 py-12">
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">Portfolio</h1>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            Welcome to my art portfolio! A collection of my creative work, including pixel art, digital illustrations, and photography.
          </p>
        </motion.div>

        <div className="flex justify-center border-b border-white/10 mb-8">
          {categories.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition-colors relative text-lg ${activeTab === tab ? "text-text" : "text-muted hover:text-text"}`}
              whileTap={{ scale: 0.95 }}
            >
              {tab}
              {activeTab === tab && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-accent" layoutId="underline_portfolio" />
              )}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[250px]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeArtworks && activeArtworks.map((art, index) => (
              <Card key={`${activeTab}-${index}`} imageSrc={art.imageUrl} title={art.title} description={art.description} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
