import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const sections = [
  "Full Resume", "Summary", "Work Experience", "Projects", "Skills", "Education", "Relevant Coursework", "Volunteer Work"
];

const SectionContent = ({ section, data }) => {
  if (!data) return <p className="text-muted">No data available for this section.</p>;

  if (section === "Projects") {
    return (
      <div className="space-y-4">
        {data.map((project, index) => (
          <motion.div 
            key={index} 
            className="p-4 bg-background rounded-lg border border-white/10 transition-colors hover:bg-surface"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-lg font-semibold text-primary">{project.title}</h3>
            <p className="text-muted mt-1">{project.description}</p>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline mt-2 inline-block">
                View Project &rarr;
              </a>
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  if (section === "Skills" || section === "Relevant Coursework") {
    return (
      <div className="space-y-6">
        {Object.entries(data).map(([category, items], index) => (
          <div key={index}>
            <h3 className="text-lg font-semibold text-primary mb-3">{category}</h3>
            <div className="flex flex-wrap gap-3">
              {Array.isArray(items) && items.map((item, itemIndex) => (
                <motion.span 
                  key={itemIndex} 
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium border border-primary/30"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(167, 139, 250, 0.2)" }} // Using primary color with more opacity
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (section === "Work Experience" || section === "Volunteer Work") {
    return (
      <ul className="space-y-4">
        {data.map((item, index) => (
          <motion.li 
            key={index} 
            className="p-4 rounded-lg border border-transparent transition-colors hover:bg-surface hover:border-white/10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-lg font-semibold text-text">{item.title}</h3>
            <p className="text-sm text-muted">{item.role} ({item.duration})</p>
            <p className="mt-2 text-text/90">{item.description}</p>
          </motion.li>
        ))}
      </ul>
    );
  }

  // Default layout for simple text or array of strings (like Education)
  return (
    <div className="prose prose-invert max-w-none">
      {Array.isArray(data) ? 
        <ul>{data.map((item, i) => <li key={i}>{item}</li>)}</ul> : 
        <p>{data}</p>
      }
    </div>
  );
};

export default function Resume() {
  const [activeSection, setActiveSection] = useState("Full Resume");
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const docRef = doc(db, 'resume', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setResumeData(docSnap.data());
        } else {
          console.log("No resume data found.");
          setResumeData({});
        }
      } catch (error) {
        console.error("Error fetching resume data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResumeData();
  }, []);

  if (loading || !resumeData) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-text">Loading Resume...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-text pt-24">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <div className="sticky top-28">
            <h2 className="text-xl font-bold text-text mb-4">Sections</h2>
            <ul className="space-y-2">
              {sections.map(section => (
                <li key={section}>
                  <button
                    onClick={() => setActiveSection(section)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeSection === section ? "bg-primary text-white" : "text-muted hover:bg-surface"}`}
                  >
                    {section}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="w-full md:w-3/4 bg-surface p-8 rounded-lg border border-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-text mb-6 border-b border-white/10 pb-4">{activeSection}</h1>
              {activeSection === "Full Resume" ? (
                <div className="space-y-8">
                  {sections.slice(1).map(sec => (
                    <section key={sec}>
                      <h2 className="text-2xl font-bold text-text mb-4">{sec}</h2>
                      <SectionContent section={sec} data={resumeData[sec]} />
                    </section>
                  ))}
                </div>
              ) : (
                <SectionContent section={activeSection} data={resumeData[activeSection]} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
