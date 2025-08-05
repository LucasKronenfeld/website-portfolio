import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ProjectCard from "./components/projectCard";
import Card from "./components/Card";

const AnimatedSection = ({ children }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  return <motion.div ref={ref} style={{ y, opacity }}>{children}</motion.div>;
};

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [featuredPortfolio, setFeaturedPortfolio] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const projectsSnap = await getDoc(doc(db, 'projects', 'data'));
        if (projectsSnap.exists()) {
          const featured = Object.values(projectsSnap.data()).flat().filter(p => p.isFeatured);
          setFeaturedProjects(featured);
        }

        const portfolioSnap = await getDoc(doc(db, 'portfolio', 'data'));
        if (portfolioSnap.exists()) {
            const featured = Object.values(portfolioSnap.data()).flat().filter(p => p.isFeatured);
            setFeaturedPortfolio(featured);
        }
      } catch (error) {
        console.error("Error fetching featured content:", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-background text-text min-h-screen">
      <div className="flex flex-col items-center justify-center text-center py-24 px-6 bg-accent rounded-b-3xl shadow-lg">
        <motion.h1 className="text-4xl md:text-5xl font-bold mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          Lucas Kronenfeld
        </motion.h1>
        <motion.p className="text-lg md:text-xl max-w-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
          A passionate Computer Engineering student, creative problem-solver, and developer.
        </motion.p>
      </div>

      <div className="container mx-auto px-6 py-16 space-y-24">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-center mb-10">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div key={`proj-${index}`} whileHover={{ scale: 1.05 }}>
                 <ProjectCard {...project} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/projects" className="px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-darkback transition-colors">
              View All Projects
            </Link>
          </div>
        </AnimatedSection>
        
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-center mb-10">Featured Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPortfolio.map((item, index) => (
              <motion.div key={`port-${index}`} whileHover={{ scale: 1.05 }}>
                 <Card {...item} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/portfolio" className="px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-darkback transition-colors">
              View All Portfolio Items
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection>
            <div className="text-center mt-20 py-12 bg-accent rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-4">Let's Create Something Amazing</h2>
                <p className="text-lg max-w-xl mx-auto mb-6">Have a project in mind? I'm always open to new opportunities.</p>
                <a href="mailto:kronenfeldlucas@gmail.com" className="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition-transform hover:scale-105 inline-block">
                    Get In Touch
                </a>
            </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Home;
