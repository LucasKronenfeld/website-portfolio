import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

const initialResumeData = {
    "Summary": "Please add a summary.",
    "Work Experience": [], "Projects": [], "Skills": {}, "Education": [], "Relevant Coursework": {}, "Volunteer Work": []
};

export default function AdminResume() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('Summary');

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const docRef = doc(db, 'resume', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().Summary) { // Check if data is substantial
          setResumeData(docSnap.data());
        } else {
          await setDoc(docRef, initialResumeData);
          setResumeData(initialResumeData);
          setMessage("Initialized resume with empty structure. You can now add your data.");
        }
      } catch (error) {
        console.error('Error fetching or creating resume data:', error);
        setMessage('Error fetching resume data.');
      } finally {
        setLoading(false);
      }
    };
    fetchResumeData();
  }, []);

  // --- Generic Handlers ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('Updating...');
    try {
      const docRef = doc(db, 'resume', 'data');
      await updateDoc(docRef, resumeData);
      setMessage('Resume data updated successfully!');
    } catch (error) {
      console.error('Error updating resume data:', error);
      setMessage('Error updating resume data.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const path = name.split('.');
    
    setResumeData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  // --- List Handlers (Work Experience, Projects, etc.) ---
  const handleAddItem = (section, newItem) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem]
    }));
  };

  const handleRemoveItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // --- Object Handlers (Skills, Coursework) ---
  const handleCategoryChange = (section, oldCat, newCat) => {
     if (oldCat === newCat || !newCat) return;
     const data = { ...resumeData[section] };
     data[newCat] = data[oldCat];
     delete data[oldCat];
     setResumeData(prev => ({ ...prev, [section]: data }));
  };
  
  const handleItemChange = (section, cat, index, value) => {
    const data = { ...resumeData[section] };
    data[cat][index] = value;
    setResumeData(prev => ({ ...prev, [section]: data }));
  };

  const handleAddCategory = (section) => {
    const newCategoryName = prompt("Enter the name for the new category:");
    if (newCategoryName && !resumeData[section][newCategoryName]) {
      setResumeData(prev => ({
        ...prev,
        [section]: { ...prev[section], [newCategoryName]: [] }
      }));
    }
  };
  
  const handleRemoveCategory = (section, cat) => {
    if (!confirm(`Are you sure you want to remove the category "${cat}"?`)) return;
    const data = { ...resumeData[section] };
    delete data[cat];
    setResumeData(prev => ({ ...prev, [section]: data }));
  };

  const handleAddItemToCategory = (section, cat) => {
    const data = { ...resumeData[section] };
    data[cat] = [...data[cat], "New Item"];
    setResumeData(prev => ({...prev, [section]: data}));
  };
  
  const handleRemoveItemFromCategory = (section, cat, index) => {
    const data = { ...resumeData[section] };
    data[cat] = data[cat].filter((_, i) => i !== index);
    setResumeData(prev => ({...prev, [section]: data}));
  };

  const renderSectionEditor = () => {
    const section = activeSection;
    const data = resumeData[section];

    if (section === 'Summary') {
        return (
            <div className="space-y-2">
                <label className="text-xl font-semibold text-text">Summary</label>
                <textarea name="Summary" value={resumeData.Summary} onChange={handleChange} className="w-full p-3 border border-contrast rounded-md h-48"/>
            </div>
        )
    }

    if (Array.isArray(data)) { // For Work Experience, Projects, Education, Volunteer Work
      const isObjectArray = data.length > 0 && typeof data[0] === 'object';
      const newItem = isObjectArray ? { title: "", role: "", duration: "", description: "" } : "";
      
      return (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="p-4 bg-background rounded-md space-y-3 relative">
               <button type="button" onClick={() => handleRemoveItem(section, index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>
              {isObjectArray ? (
                Object.keys(item).map(key => (
                  <div key={key}>
                    <label className="capitalize text-sm font-medium">{key}</label>
                    <input name={`${section}.${index}.${key}`} value={item[key]} onChange={handleChange} placeholder={key} className="w-full p-2 border border-contrast rounded"/>
                  </div>
                ))
              ) : (
                 <input name={`${section}.${index}`} value={item} onChange={handleChange} placeholder="Value" className="w-full p-2 border border-contrast rounded"/>
              )}
            </div>
          ))}
          <button type="button" onClick={() => handleAddItem(section, newItem)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add New {section}</button>
        </div>
      );
    } 

    if (typeof data === 'object') { // For Skills, Relevant Coursework
        return (
            <div className="space-y-4">
                {Object.entries(data).map(([cat, items]) => (
                    <div key={cat} className="p-4 bg-background rounded-md space-y-3">
                        <div className="flex items-center gap-2">
                            <input value={cat} onChange={(e) => handleCategoryChange(section, cat, e.target.value)} className="text-lg font-semibold bg-transparent border-b border-contrast"/>
                            <button type="button" onClick={() => handleRemoveCategory(section, cat)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
                        </div>
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input value={item} onChange={(e) => handleItemChange(section, cat, index, e.target.value)} className="w-full p-2 border border-contrast rounded"/>
                                <button type="button" onClick={() => handleRemoveItemFromCategory(section, cat, index)} className="text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>
                            </div>
                        ))}
                         <button type="button" onClick={() => handleAddItemToCategory(section, cat)} className="px-3 py-1 mt-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">Add Item</button>
                    </div>
                ))}
                <button type="button" onClick={() => handleAddCategory(section)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add New Category to {section}</button>
            </div>
        )
    }

    return <div>Select a section to edit.</div>
  }

  if (loading) return <div>Loading Resume Editor...</div>;
  if (!resumeData) return <div className="text-red-500">Error: Resume data could not be loaded.</div>;
  
  const sections = Object.keys(resumeData);

  return (
    <div className="flex gap-8">
      {/* --- Left Navigation --- */}
      <div className="w-1/4 bg-contrast p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">Sections</h3>
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

      {/* --- Right Editor --- */}
      <form onSubmit={handleUpdate} className="w-3/4 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-text">Editing: {activeSection}</h3>
          <button className="px-6 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-darkback transition-colors" type="submit">
            Save All Changes
          </button>
        </div>
        {message && <p className="text-center p-3 bg-gray-200 rounded-md text-gray-800">{message}</p>}

        <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border border-dashed border-contrast rounded-lg"
        >
            {renderSectionEditor()}
        </motion.div>
      </form>
    </div>
  );
}
