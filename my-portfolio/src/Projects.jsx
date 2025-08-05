import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestoreData } from "./useFirestoreData";
import ProjectCard from "./components/projectCard";
import Card from "./components/Card";

export default function Projects() {
  const { data: projectsData, loading } = useFirestoreData('projects');
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (projectsData && !activeTab) {
      setActiveTab(Object.keys(projectsData)[0]);
    }
  }, [projectsData, activeTab]);

  const categories = projectsData ? Object.keys(projectsData) : [];
  const activeProjects = activeTab && projectsData ? projectsData[activeTab] : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-text">
        <div className="text-xl font-semibold">Loading Projects...</div>
      </div>
    );
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
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">Projects</h1>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            Explore my projects, including computer science work, ongoing developments, and personal creations.
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
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-accent" layoutId="underline_projects" />
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
            {activeProjects.map((project, index) => (
              activeTab === "In Progress" ? (
                <Card key={`${activeTab}-card-${index}`} imageSrc={project.imageSrc} title={project.title} description={project.description} />
              ) : (
                <ProjectCard key={`${activeTab}-proj-${index}`} imageSrc={project.imageSrc} title={project.title} description={project.description} link={project.link} />
              )
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
