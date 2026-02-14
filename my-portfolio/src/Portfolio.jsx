import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import FeatureRow from "./components/FeatureRow";
import BentoGrid from "./components/BentoGrid";

export default function Portfolio() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const docRef = doc(db, 'portfolio', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const order = data._categoryOrder || Object.keys(data).filter(k => k !== '_categoryOrder');
          const { _categoryOrder: _, ...categories } = data;
          setCategoryOrder(order);
          setPortfolioData(categories);
          if (order.length > 0) {
            setActiveTab(order[0]);
          } else if (Object.keys(categories).length > 0) {
            setActiveTab(Object.keys(categories)[0]);
          }
        } else {
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
  
  const categories = categoryOrder.filter(cat => portfolioData && portfolioData[cat]);
  const activeArtworks = activeTab && portfolioData ? (portfolioData[activeTab] || []).filter(item => !item.archived) : [];

  // Check if current category should use bento grid (photography-related)
  const useBentoGrid = activeTab && (
    activeTab.toLowerCase().includes('photo') || 
    activeTab.toLowerCase().includes('photography')
  );

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-background text-text"><div className="text-xl font-semibold">Loading Portfolio...</div></div>;
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-3 sm:mb-4">Portfolio</h1>
          <p className="text-base sm:text-lg text-muted max-w-3xl mx-auto px-4">
            A collection of my creative work, including pixel art, digital illustrations, and photography.
          </p>
        </motion.div>

        <div className="flex justify-center border-b border-white/10 mb-6 sm:mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 sm:space-x-4 px-4 sm:px-0 min-w-min">
            {categories.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors relative text-base sm:text-lg whitespace-nowrap ${activeTab === tab ? "text-text" : "text-muted hover:text-text"}`}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
                {activeTab === tab && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-accent" layoutId="underline_portfolio" />}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className={useBentoGrid ? "" : "space-y-12 sm:space-y-16"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {activeArtworks && activeArtworks.length > 0 && (
              useBentoGrid ? (
                <BentoGrid items={activeArtworks} />
              ) : (
                activeArtworks.map((art, index) => (
                  <FeatureRow key={`${activeTab}-${index}`} item={art} index={index} />
                ))
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
