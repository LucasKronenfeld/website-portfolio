import { useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./components/projectCard";
import Card from "./components/Card";

export default function Projects() {
  const [activeTab, setActiveTab] = useState("Computer Science");

  const projects = {
    "Computer Science": [
      { imageSrc: "Pixel_Logo.png", title: "Pixel Tees Store", description: "e-commerce website for selling tshirts. (payment system shut down)", link: "https://pixeltees.org", },    
      { imageSrc: "csProject2.png", title: "CS Project 2", description: "Another CS project", link: "https://example.com/cs2" },
    ],
    "In Progress": [
      { imageSrc: "progressProject1.png", title: "In Progress 1", description: "A project currently in development" },
      { imageSrc: "progressProject2.png", title: "In Progress 2", description: "Another work in progress" },
    ],
    "Personal": [
      { imageSrc: "personalProject1.png", title: "Personal Project 1", description: "A personal passion project", link: "https://example.com/personal1" },
      { imageSrc: "personalProject2.png", title: "Personal Project 2", description: "Another personal project", link: "https://example.com/personal2" },
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
        {/* Projects Title */}
        <motion.h1 
          className="text-4xl font-bold text-text text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Projects
        </motion.h1>

        {/* Intro Paragraph */}
        <motion.p 
          className="text-text text-lg mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Explore my projects, including computer science work, ongoing developments, and personal creations. Click "Inspect" to view more details.
        </motion.p>

        {/* Tabs Bar - Chrome-Style */}
        <motion.div 
          className="relative w-full flex border-4 border-contrast border-b-0 rounded-t-lg bg-contrast"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {Object.keys(projects).map((tab) => (
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Cards Grid - Limited to 3 Cards Per Row */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {projects[activeTab].map((project, index) => (
              <motion.div key={index} whileHover={{ scale: 1.05 }}>
                {activeTab === "In Progress" ? (
                  <Card imageSrc={project.imageSrc} title={project.title} description={project.description} />
                ) : (
                  <ProjectCard imageSrc={project.imageSrc} title={project.title} description={project.description} link={project.link} />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
