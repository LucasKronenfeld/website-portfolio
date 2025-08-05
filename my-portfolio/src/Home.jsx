import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebaseConfig";
import { collection, getDocs, limit, orderBy, query, doc, getDoc } from "firebase/firestore";
import ProjectCard from "./components/projectCard";

// Helper component for scroll-triggered animations
const AnimatedSection = ({ children, direction = 'up' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [direction === 'up' ? 100 : -100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <motion.div ref={ref} style={{ y, opacity }}>
      {children}
    </motion.div>
  );
};

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const targetRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  // 3D-like transformations for images
  const rotateX1 = useTransform(scrollYProgress, [0, 0.5], [20, 0]);
  const rotateY1 = useTransform(scrollYProgress, [0, 0.5], [-20, 0]);
  const rotateX2 = useTransform(scrollYProgress, [0.5, 1], [0, -20]);
  const rotateY2 = useTransform(scrollYProgress, [0.5, 1], [0, 20]);


  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'projects', 'data'));
        if (docSnap.exists()) {
          const csProjects = docSnap.data()['Computer Science'] || [];
          setFeaturedProjects(csProjects.slice(0, 3));
        }
      } catch (error) { console.error("Error fetching projects:", error); }
    };

    const fetchRecentPosts = async () => {
      try {
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(3));
        const querySnapshot = await getDocs(postsQuery);
        setRecentPosts(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) { console.error("Error fetching posts:", error); }
    };

    fetchFeaturedProjects();
    fetchRecentPosts();
  }, []);

  return (
    <div className="bg-background text-text min-h-screen" ref={targetRef}>
      {/* --- Hero Section --- */}
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-accent rounded-b-3xl shadow-lg">
        <motion.h1 className="text-4xl md:text-5xl font-bold mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          Lucas Kronenfeld
        </motion.h1>
        <motion.p className="text-lg md:text-xl max-w-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
          A passionate Computer Engineering student, creative problem-solver, and developer.
        </motion.p>
      </div>

      <div className="container mx-auto px-6 py-16 space-y-24">
        
        {/* --- Interactive Visuals Section --- */}
        <div className="flex flex-col md:flex-row justify-around items-center gap-12 min-h-[30vh]">
            <motion.div style={{ rotateX: rotateX1, rotateY: rotateY1, perspective: 1000 }}>
                <img src="/deskWorks.svg" alt="Desk Works" className="w-48 h-48"/>
            </motion.div>
            <p className="max-w-md text-center text-lg md:text-xl">Blending technical expertise with creative expression.</p>
            <motion.div style={{ rotateX: rotateX2, rotateY: rotateY2, perspective: 1000 }}>
                <img src="/computerScreen.svg" alt="Computer Screen" className="w-48 h-48"/>
            </motion.div>
        </div>

        {/* --- Featured Projects Section --- */}
        <AnimatedSection direction="up">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div key={index} whileHover={{ scale: 1.05 }}>
                 <ProjectCard {...project} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/projects" className="px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-darkback transition-colors">
              View All Projects
            </Link>
          </div>
        </AnimatedSection>

        {/* --- Recent Blog Posts Section --- */}
        <AnimatedSection direction="up">
          <h2 className="text-3xl font-bold text-center mb-8">Recent Posts</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {recentPosts.map(post => (
              <motion.div key={post.id} className="bg-accent p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-primary">{post.title}</h3>
                <p className="text-sm text-text-secondary mb-2">{new Date(post.createdAt.toDate()).toLocaleDateString()}</p>
                <p className="text-gray-400">{post.content.substring(0, 100)}...</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/blog" className="px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-darkback transition-colors">
              Read The Blog
            </Link>
          </div>
        </AnimatedSection>

        {/* --- Call to Action --- */}
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
