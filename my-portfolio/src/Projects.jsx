import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import ProjectCard from './components/projectCard';

export default function Projects() {
  const [projectsData, setProjectsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const docRef = doc(db, 'projects', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          const data = docSnap.data();
          setProjectsData(data);
          setActiveCategory(Object.keys(data)[0]); // Set initial category
        } else {
          console.log("No projects data found in the database.");
        }
      } catch (error) {
        console.error("Error fetching projects data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectsData();
  }, []);
  
  const categories = Object.keys(projectsData);
  const projects = activeCategory ? projectsData[activeCategory] : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading Projects...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-text">My Projects</h1>

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

      {/* --- Projects List --- */}
      <div className="space-y-8">
        {projects.map((project, index) => (
          <motion.div
            key={`${activeCategory}-${index}`} // Force re-render on category change
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProjectCard
              imageSrc={project.imageSrc}
              title={project.title}
              description={project.description}
              link={project.link}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
