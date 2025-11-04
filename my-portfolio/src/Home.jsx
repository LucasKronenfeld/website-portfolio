import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import RetroHero from './components/RetroHero';
import PixelDivider from './components/PixelDivider';
import DesktopIcon from './components/ui/DesktopIcon';
import { Link } from 'react-router-dom';
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
      <RetroHero />
      <PixelDivider variant="ascii" />

      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-10" id="featured-work">
        <motion.h2 
          className="font-mono text-2xl md:text-3xl leading-100 text-center mb-6 md:mb-8 text-ink"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          Featured Work
        </motion.h2>

        {featuredContent.length > 0 ? (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {featuredContent.map(item => (
              <motion.div key={item.id} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col items-center">
                <Link to={item.link} className="focus:outline-none">
                  <DesktopIcon label={item.title} src={item.image} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-muted py-6 px-4">
            <p className="text-sm md:text-base">No featured items to display at the moment.</p>
            <p className="text-xs mt-1">You can select items to feature from the Admin Dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}
