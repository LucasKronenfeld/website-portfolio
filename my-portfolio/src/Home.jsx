import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Hero from './components/Hero';
import GridItem from './components/GridItem';

// Processes all data and filters for featured items.
const processFetchedData = (portfolioData, projectsData) => {
  let combined = [];

  // Add featured portfolio items
  if (portfolioData) {
    for (const category in portfolioData) {
      if (portfolioData[category]) {
        portfolioData[category].forEach(item => {
          if (item.featured) {
            combined.push({
              id: `portfolio-${category}-${item.title}`,
              title: item.title,
              image: item.imageUrl,
              category: category,
              link: `/portfolio`,
            });
          }
        });
      }
    }
  }

  // Add featured project items
  if (projectsData) {
    for (const category in projectsData) {
      if(projectsData[category]) {
        projectsData[category].forEach(item => {
          if (item.featured) {
            combined.push({
              id: `projects-${category}-${item.title}`,
              title: item.title,
              image: item.imageSrc,
              category: category,
              link: item.link || `/projects`,
            });
          }
        });
      }
    }
  }

  // Assign size property for the bento grid layout.
  return combined.map((item, index) => ({
    ...item,
    size: index === 0 ? 'large' : 'default',
  }));
};


export default function Home() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [projectsData, setProjectsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const portfolioRef = doc(db, 'portfolio', 'data');
        const projectsRef = doc(db, 'projects', 'data');
        
        const [portfolioSnap, projectsSnap] = await Promise.all([
          getDoc(portfolioRef),
          getDoc(projectsRef)
        ]);

        if (portfolioSnap.exists()) setPortfolioData(portfolioSnap.data());
        if (projectsSnap.exists()) setProjectsData(projectsSnap.data());

      } catch (error) {
        console.error("Error fetching homepage data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const featuredContent = useMemo(() => {
    return processFetchedData(portfolioData, projectsData);
  }, [portfolioData, projectsData]);

  if (loading) {
    return (
      <div className="bg-background text-text min-h-screen flex items-center justify-center">
        <p className="text-2xl">Loading amazing things...</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-text min-h-screen">
      <Hero />
      
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24" id="featured-work">
        <motion.h2 
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-12 text-text"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Featured Work
        </motion.h2>
        
        {featuredContent.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 auto-rows-[200px] sm:auto-rows-[250px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {featuredContent.map(item => (
              <motion.div key={item.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <GridItem item={item} size={item.size} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-muted py-8 px-4">
            <p className="text-base sm:text-lg">No featured items to display at the moment.</p>
            <p className="text-sm mt-2">You can select items to feature from the Admin Dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}
