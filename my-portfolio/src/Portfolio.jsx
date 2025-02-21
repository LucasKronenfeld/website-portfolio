import { useState } from "react";
import { motion } from "framer-motion";
import Card from "./components/Card";

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("Pixel");

  const artworks = {
    Pixel: [
      { imageSrc: "modernDeskWork.png", title: "Pixel Art 1", description: "A pixel piece" },
      { imageSrc: "modernDeskWork.png", title: "Pixel Art 2", description: "Another pixel piece that is truly wonderful" },
      { imageSrc: "modernDeskWork.png", title: "Pixel Art 3", description: "Another pixel piece" },
      { imageSrc: "modernDeskWork.png", title: "Pixel Art 4", description: "Another pixel piece" },
      { imageSrc: "modernDeskWork.png", title: "Pixel Art 5", description: "Another pixel piece" },
    ],
    "2D": [
      { imageSrc: "modernDeskWork.png", title: "2D Art 1", description: "A 2D artwork" },
      { imageSrc: "modernDeskWork.png", title: "2D Art 2", description: "Another 2D artwork" },
    ],
    Photography: [
      { imageSrc: "modernDeskWork.png", title: "Photo 1", description: "A beautiful shot" },
      { imageSrc: "modernDeskWork.png", title: "Photo 2", description: "Another great shot" },
    ],
  };

  return (
    <motion.div 
      className="min-h-screen bg-background rounded-lg p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-screen-2xl mx-auto p-4 relative">
        {/* Portfolio Title */}
        <motion.h1 
          className="text-4xl font-bold text-text text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Portfolio
        </motion.h1>

        {/* Intro Paragraph */}
        <motion.p 
          className="text-text text-lg mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Welcome to my art portfolio! Here you’ll find a collection of my creative work, including pixel art, digital illustrations, and photography. 
          Explore the different categories using the tabs below.
        </motion.p>

        {/* Tabs Bar - Chrome-Style */}
        <motion.div 
          className="relative w-full flex border-4 border-contrast border-b-0 rounded-t-lg bg-contrast"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {Object.keys(artworks).map((tab) => (
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

        {/* Content Section with Border */}
        <motion.div 
          className="border-4 border-contrast border-t-0 rounded-b-lg p-4 bg-background"
          key={activeTab}
          initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        >
          {/* Cards Grid - Limited to 3 Cards Per Row */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {artworks[activeTab].map((art, index) => (
              <motion.div key={index} whileHover={{ scale: 1.05 }}>
                <Card imageSrc={art.imageSrc} title={art.title} description={art.description} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
