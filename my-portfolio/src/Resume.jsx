import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const sections = [
  "Summary", "Work Experience", "Projects", "Skills", "Education"
];

const SectionContent = ({ section, data }) => {
  if (!data) return <p className="text-gray-500">This section is not available.</p>;

  switch (section) {
    case "Work Experience":
      return (
        <div className="space-y-6">
          {data.map((job, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
              <p className="text-md text-gray-600">{job.role} | {job.duration}</p>
              <p className="mt-2 text-gray-700">{job.description}</p>
            </motion.div>
          ))}
        </div>
      );
    case "Projects":
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.map((project, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                  <p className="mt-2 text-gray-700">{project.description}</p>
                  {project.link && <a href={project.link} className="text-blue-600 hover:underline mt-4 inline-block">View Project</a>}
                </motion.div>
              ))}
            </div>
          );
    case "Skills":
      return (
        <div className="space-y-4">
          {Object.entries(data).map(([category, skills]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.span 
                    key={index} 
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    case "Education":
      return (
        <div className="space-y-4">
          {data.map((edu, index) => (
             <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <h3 className="text-xl font-semibold text-gray-800">{edu.degree}</h3>
                <p className="text-md text-gray-600">{edu.institution} | {edu.year}</p>
             </motion.div>
          ))}
        </div>
      );
    default:
      return <p className="text-gray-700">{data}</p>;
  }
};

export default function Resume() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error("Error fetching resume data: ", err);
        setError("Could not load resume data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchResumeData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center text-gray-800">Loading Resume...</div>;
  }
  
  if (error) {
    return <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-gray-800 pt-28">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-5xl font-bold text-gray-900">Resume</h1>
            <p className="text-lg text-gray-600 mt-2">My professional background and skills.</p>
        </motion.div>

        <div className="space-y-12">
            {sections.map(section => (
                <motion.section 
                    key={section}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-200">{section}</h2>
                    <SectionContent section={section} data={resumeData[section]} />
                </motion.section>
            ))}
        </div>
      </div>
    </div>
  );
}
