import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const initialProjectsData = {
    "Computer Science": [
      { imageSrc: "/Pixel_Logo.png", title: "Pixel Tees Store", description: "e-commerce website for selling tshirts. (payment system shut down)", link: "https://pixeltees.org" },    
      { imageSrc: "/modernDeskWork.png", title: "LucasKronenfeld.com", description: "design a website to highlight projects and skills", link: "https://lucaskronenfeld.com" },
      { imageSrc: "/Designer.jpeg", title: "Dentist Database creation", description: "design database and queries for a dentist office", link: "https://github.com/LucasKronenfeld/SQL-Project" },
    ],
    "In Progress": [
      { imageSrc: "/progressProject1.png", title: "In Progress 1", description: "A project currently in development", link: "" },
      { imageSrc: "/progressProject2.png", title: "In Progress 2", description: "Another work in progress", link: "" },
    ],
    "Personal": [
      { imageSrc: "/personalProject1.png", title: "Personal Project 1", description: "A personal passion project", link: "" },
      { imageSrc: "/personalProject2.png", title: "Personal Project 2", description: "Another personal project", link: "" },
    ],
  };

export default function AdminProjects() {
  const [projectsData, setProjectsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const docRef = doc(db, 'projects', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          setProjectsData(docSnap.data());
        } else {
          await setDoc(docRef, initialProjectsData);
          setProjectsData(initialProjectsData);
          setMessage("Initialized projects with your legacy data.");
        }
      } catch (error) {
        console.error('Error handling projects data:', error);
        setMessage('Error fetching or creating projects data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectsData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('Updating...');
    try {
      const docRef = doc(db, 'projects', 'data');
      await updateDoc(docRef, projectsData);
      setMessage('Projects updated successfully!');
    } catch (error) {
      console.error('Error updating projects data:', error);
      setMessage('Error updating projects data.');
    }
  };

  const handleCategoryChange = (oldCat, newCat) => {
     if (oldCat === newCat || !newCat) return;
     const data = { ...projectsData };
     data[newCat] = data[oldCat];
     delete data[oldCat];
     setProjectsData(data);
  };
  
  const handleItemChange = (cat, index, field, value) => {
    const data = { ...projectsData };
    data[cat][index][field] = value;
    setProjectsData(data);
  };

  const handleAddCategory = () => {
    const newCategoryName = prompt("Enter the name for the new category:");
    if (newCategoryName && !projectsData[newCategoryName]) {
      setProjectsData(prev => ({ ...prev, [newCategoryName]: [] }));
    }
  };
  
  const handleRemoveCategory = (cat) => {
    if (!confirm(`Are you sure you want to remove the category "${cat}"?`)) return;
    const data = { ...projectsData };
    delete data[cat];
    setProjectsData(data);
  };

  const handleAddItemToCategory = (cat) => {
    const data = { ...projectsData };
    data[cat] = [...data[cat], { imageSrc: "", title: "", description: "", link: "" }];
    setProjectsData(data);
  };
  
  const handleRemoveItemFromCategory = (cat, index) => {
    const data = { ...projectsData };
    data[cat] = data[cat].filter((_, i) => i !== index);
    setProjectsData(data);
  };

  if (loading) return <div>Loading Projects Editor...</div>;
  if (!projectsData) return <div className="text-red-500">Error: Projects data could not be loaded.</div>;

  return (
    <form onSubmit={handleUpdate} className="space-y-8">
        <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-text">Edit Projects</h3>
            <button className="px-6 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-darkback transition-colors" type="submit">
                Save All Project Changes
            </button>
        </div>
        {message && <p className="text-center p-3 bg-gray-200 rounded-md text-gray-800">{message}</p>}

        <div className="space-y-6">
            {Object.entries(projectsData).map(([category, items]) => (
                <div key={category} className="p-4 border border-contrast rounded-lg space-y-4">
                    <div className="flex items-center gap-2">
                        <input value={category} onChange={(e) => handleCategoryChange(category, e.target.value)} className="text-xl font-semibold bg-transparent border-b border-contrast text-text"/>
                        <button type="button" onClick={() => handleRemoveCategory(category)} className="text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>
                    </div>
                    {items.map((item, index) => (
                        <div key={index} className="p-4 bg-background rounded-md space-y-3 relative">
                            <button type="button" onClick={() => handleRemoveItemFromCategory(category, index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>
                            {Object.keys(item).map(field => (
                                <div key={field}>
                                    <label className="capitalize text-sm font-medium text-text">{field}</label>
                                    <input value={item[field]} onChange={(e) => handleItemChange(category, index, field, e.target.value)} placeholder={field} className="w-full p-2 border border-contrast rounded"/>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button type="button" onClick={() => handleAddItemToCategory(category)} className="px-3 py-1 mt-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">Add Item to {category}</button>
                </div>
            ))}
            <button type="button" onClick={() => handleAddCategory()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add New Category</button>
        </div>
    </form>
  );
}
