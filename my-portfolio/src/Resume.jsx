import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const sections = [
  "Full Resume", "Summary", "Work Experience", "Projects", "Skills", "Education", "Relevant Coursework", "Volunteer Work"
];

const SectionContent = ({ section, data }) => {
  if (!data) return <p className="text-muted text-sm sm:text-base">No data available for this section.</p>;

  if (section === "Projects") {
    return (
      <div className="space-y-3 sm:space-y-4">
        {data.map((project, index) => (
          <motion.div 
            key={index} 
            className="p-3 sm:p-4 bg-background rounded-lg border border-white/10 transition-colors hover:bg-surface"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-base sm:text-lg font-semibold text-primary">{project.title}</h3>
            <p className="text-muted mt-1 text-sm sm:text-base">{project.description}</p>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline mt-2 inline-block text-sm sm:text-base">
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
      <div className="space-y-4 sm:space-y-6">
        {Object.entries(data).map(([category, items], index) => (
          <div key={index}>
            <h3 className="text-base sm:text-lg font-semibold text-primary mb-2 sm:mb-3">{category}</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {Array.isArray(items) && items.map((item, itemIndex) => (
                <motion.span 
                  key={itemIndex} 
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 text-text rounded-full font-medium border border-primary/30 text-xs sm:text-sm"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(167, 139, 250, 0.2)" }}
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
      <ul className="space-y-3 sm:space-y-4">
        {data.map((item, index) => (
          <motion.li 
            key={index} 
            className="p-3 sm:p-4 rounded-lg border border-transparent transition-colors hover:bg-surface hover:border-white/10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-base sm:text-lg font-semibold text-text">{item.title}</h3>
            <p className="text-xs sm:text-sm text-muted">{item.role} ({item.duration})</p>
            <p className="mt-2 text-text/90 text-sm sm:text-base">{item.description}</p>
          </motion.li>
        ))}
      </ul>
    );
  }

  // Default layout for simple text or array of strings (like Education)
  return (
    <div className="prose prose-invert max-w-none text-sm sm:text-base">
      {Array.isArray(data) ? 
        <ul className="space-y-1">{data.map((item, i) => <li key={i}>{item}</li>)}</ul> : 
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
    return <div className="min-h-screen bg-background flex items-center justify-center text-text px-4">
      <div className="text-lg sm:text-xl font-semibold">Loading Resume...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background text-text pt-20 sm:pt-24">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col lg:flex-row gap-6 sm:gap-8">
        <aside className="w-full lg:w-1/4">
          <div className="lg:sticky lg:top-28">
            <h2 className="text-lg sm:text-xl font-bold text-text mb-3 sm:mb-4">Sections</h2>
            <ul className="space-y-1 sm:space-y-2 grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-0">
              {sections.map(section => (
                <li key={section}>
                  <button
                    onClick={() => setActiveSection(section)}
                    className={`w-full text-left px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${activeSection === section ? "bg-primary text-white" : "text-muted hover:bg-surface"}`}
                  >
                    {section}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="w-full lg:w-3/4 bg-surface p-4 sm:p-6 md:p-8 rounded-lg border border-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-text mb-4 sm:mb-6 border-b border-white/10 pb-3 sm:pb-4">{activeSection}</h1>
              {activeSection === "Full Resume" ? (
                <div className="space-y-6 sm:space-y-8">
                  {sections.slice(1).map(sec => (
                    <section key={sec}>
                      <h2 className="text-xl sm:text-2xl font-bold text-text mb-3 sm:mb-4">{sec}</h2>
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
