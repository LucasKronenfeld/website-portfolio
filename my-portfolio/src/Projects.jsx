import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import FeatureRow from "./components/FeatureRow";

export default function Projects() {
  const [projectsData, setProjectsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const docRef = doc(db, 'projects', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProjectsData(data);
          if (Object.keys(data).length > 0) {
            setActiveTab(Object.keys(data)[0]);
          }
        } else {
          setProjectsData({});
        }
      } catch (err) {
        console.error("Error fetching projects data:", err);
        setError("Could not load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, []);

  return (
    <motion.div
      className="relative min-h-screen bg-black overflow-hidden pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob [animation-delay:2s]"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob [animation-delay:4s]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Projects</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore my computer science work, ongoing developments, and personal creations.
          </p>
        </motion.div>

        {loading && <div className="text-center text-white">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        {!loading && !error && projectsData && Object.keys(projectsData).length > 0 ? (
          <>
            <div className="flex justify-center space-x-2 md:space-x-4 mb-12 flex-wrap">
              {Object.keys(projectsData).map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 my-1 rounded-full text-sm md:text-base font-semibold transition-all duration-300 border border-white/20
                    ${activeTab === tab ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-10 border border-white/10"
              >
                {activeTab && projectsData[activeTab] && (
                  <FeatureRow
                    features={projectsData[activeTab].features}
                    title={projectsData[activeTab].title}
                    description={projectsData[activeTab].description}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          !loading && !error && <div className="text-center text-gray-400">No projects found.</div>
        )}
      </div>
    </motion.div>
  );
}
