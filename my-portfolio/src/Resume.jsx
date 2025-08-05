import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const sections = [
  "Full Resume", "Summary", "Work Experience", "Projects", "Skills", "Education", "Relevant Coursework", "Volunteer Work"
];

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
          console.log("No resume data found in the database. Please visit the admin dashboard to set it up.");
          // You could set some default empty state here if you want.
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
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background rounded-lg p-8 flex">
      <div className="w-1/4 bg-contrast p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Sections</h2>
        <ul>
          {sections.map(section => (
            <li key={section}>
              <button
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition ${activeSection === section ? "bg-secondary text-white" : "text-white hover:bg-darkback"}`}
              >
                {section}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <motion.div
        className={`w-3/4 p-6 bg-white rounded-lg shadow-lg ml-4 overflow-y-auto max-h-screen ${activeSection === "Full Resume" ? "text-black" : ""}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-text mb-4">{activeSection}</h1>

        {activeSection === "Full Resume" ? (
          <div className="overflow-y-auto max-h-screen p-4">
            {sections.slice(1).map(section => (
              <motion.div
                key={section}
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-xl font-bold mb-2">{section}</h2>
                {resumeData[section] && (section === "Skills" || section === "Relevant Coursework") ? (
                  Object.entries(resumeData[section]).map(([category, items], index) => (
                    <div key={index} className="mb-4">
                      <h3 className="text-lg font-semibold mb-1">{category}</h3>
                      <p>{Array.isArray(items) ? items.join(", ") : items}</p>
                    </div>
                  ))
                ) : Array.isArray(resumeData[section]) ? (
                  <ul>
                    {resumeData[section].map((item, index) => (
                      <li key={index} className="mb-4">
                        {typeof item === "string" ? (
                          <p className="text-lg">{item}</p>
                        ) : (
                          <>
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            {item.role && <p className="text-sm text-gray-600">{item.role} ({item.duration})</p>}
                            <p className="mt-2">{item.description}</p>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="whitespace-pre-wrap text-lg">{resumeData[section]}</p>
                )}
              </motion.div>
            ))}
          </div>
        ) : activeSection === "Projects" ? (
          <div className="space-y-6">
            {resumeData["Projects"] && resumeData["Projects"].map((project, index) => (
              <motion.div
                key={index}
                className="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-secondary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h2 className="text-xl font-bold text-text">{project.title}</h2>
                <p className="text-gray-700 mt-1">{project.description}</p>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-2 block"
                  >
                    View Project
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        ) : activeSection === "Summary" ? (
          <motion.div
            className="p-6 bg-gray-100 rounded-lg shadow-md hover:bg-secondary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-gray-700">{resumeData["Summary"]}</p>
          </motion.div>
        ) : activeSection === "Work Experience" || activeSection === "Volunteer Work" ? (
          <div className="space-y-6">
            {resumeData[activeSection] && resumeData[activeSection].map((job, index) => (
              <motion.div
                key={index}
                className="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-secondary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h2 className="text-xl font-bold text-text">{job.title}</h2>
                <p className="text-gray-600 text-sm">{job.role} ({job.duration})</p>
                <p className="text-gray-700 mt-2">{job.description}</p>
              </motion.div>
            ))}
          </div>
        ) : activeSection === "Education" ? (
          <div className="space-y-6">
            {resumeData["Education"] && resumeData["Education"].map((education, index) => {
              const parts = education.split(" (");
              const school = parts[0];
              const details = parts.length > 1 ? `(${parts[1]}` : "";
              return (
                <motion.div
                  key={index}
                  className="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-secondary text-black"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h2 className="text-xl font-bold text-text">{school}</h2>
                  {details && <p className="text-gray-700 mt-1">{details}</p>}
                </motion.div>
              );
            })}
          </div>
        ) : activeSection === "Skills" || activeSection === "Relevant Coursework" ? (
          <div>
            {resumeData[activeSection] && Object.entries(resumeData[activeSection]).map(([category, items], index) => (
              <motion.div
                key={index}
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h2 className="text-xl font-semibold mb-2">{category}</h2>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(items) && items.map((item, itemIndex) => (
                    <span key={itemIndex} className="px-4 py-2 bg-gray-100 rounded-lg shadow-md transition duration-200 hover:bg-secondary text-black">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : Array.isArray(resumeData[activeSection]) ? (
          <ul>
            {resumeData[activeSection].map((item, index) => (
              <motion.li
                key={index}
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {typeof item === "string" ? (
                  <p className="text-lg">{item}</p>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    {item.role && <p className="text-sm text-gray-600">{item.role} ({item.duration})</p>}
                    <p className="mt-2">{item.description}</p>
                  </>
                )}
              </motion.li>
            ))}
          </ul>
        ) : (
          <motion.p
            className="whitespace-pre-wrap text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {resumeData[activeSection]}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
