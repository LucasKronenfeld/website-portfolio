import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFirestoreData } from './useFirestoreData';
import Hero from './components/Hero';
import GridItem from './components/GridItem';

// Helper function to process and combine data
const processFetchedData = (portfolioData, projectsData) => {
  const combined = [];

  // Add featured portfolio items
  for (const category in portfolioData) {
    portfolioData[category].forEach(item => {
      if (item.featured) { // Correctly filter for 'featured'
        combined.push({
          id: `${category}-${item.title}`,
          title: item.title,
          image: item.imageUrl,
          category: category,
          link: `/portfolio`,
        });
      }
    });
  }

  // Add featured project items
  for (const category in projectsData) {
    projectsData[category].forEach(item => {
      if (item.featured) { // Correctly filter for 'featured'
        combined.push({
          id: `${category}-${item.title}`,
          title: item.title,
          image: item.imageSrc,
          category: category,
          link: item.link || `/projects`,
        });
      }
    });
  }

  // Assign size property to the first item
  return combined.map((item, index) => ({
    ...item,
    size: index === 0 ? 'large' : 'default',
  }));
};

export default function Home() {
  const { data: portfolioData, loading: portfolioLoading } = useFirestoreData('portfolio');
  const { data: projectsData, loading: projectsLoading } = useFirestoreData('projects');

  const featuredContent = useMemo(() => {
    if (portfolioLoading || projectsLoading) return [];
    return processFetchedData(portfolioData, projectsData);
  }, [portfolioData, projectsData, portfolioLoading, projectsLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (portfolioLoading || projectsLoading) {
    return (
      <div className="bg-background text-text min-h-screen flex items-center justify-center">
        <p className="text-2xl">Loading amazing things...</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-text min-h-screen">
      <Hero />
      
      <div className="container mx-auto px-6 py-24" id="featured-work">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-text"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Featured Work
        </motion.h2>
        
        {featuredContent.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {featuredContent.map(item => (
              <motion.div key={item.id} variants={itemVariants}>
                <GridItem item={item} size={item.size} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-muted">
            <p>No featured items yet. Visit the admin dashboard to select some!</p>
          </div>
        )}
      </div>
    </div>
  );
}
