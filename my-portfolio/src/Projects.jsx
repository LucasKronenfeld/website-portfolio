import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import ProjectCard from './components/projectCard';

export default function Projects() {
  const [projectsData, setProjectsData] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const docRef = doc(db, 'projects', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProjectsData(docSnap.data());
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading Projects...</div>
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-center mb-12 text-text">My Projects</h1>
      <div className="space-y-8">
        {projectsData.items && projectsData.items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <ProjectCard
              title={item.title}
              description={item.description}
              link={item.link}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
