import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaStar } from 'react-icons/fa';

const MAX_FEATURED_PROJECTS = 3;
const MAX_FEATURED_PORTFOLIO = 3;

export default function AdminFeatured() {
  const [projectsData, setProjectsData] = useState({});
  const [portfolioData, setPortfolioData] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const projectsSnap = await getDoc(doc(db, 'projects', 'data'));
      if (projectsSnap.exists()) setProjectsData(projectsSnap.data());

      const portfolioSnap = await getDoc(doc(db, 'portfolio', 'data'));
      if (portfolioSnap.exists()) setPortfolioData(portfolioSnap.data());

    } catch (error) {
      setMessage('Error fetching data: ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleFeature = async (type, category, title) => {
    let allData, setData, docRef, maxFeatured;
    if (type === 'projects') {
        allData = { ...projectsData };
        setData = setProjectsData;
        docRef = doc(db, 'projects', 'data');
        maxFeatured = MAX_FEATURED_PROJECTS;
    } else {
        allData = { ...portfolioData };
        setData = setPortfolioData;
        docRef = doc(db, 'portfolio', 'data');
        maxFeatured = MAX_FEATURED_PORTFOLIO;
    }

    const itemIndex = allData[category].findIndex(item => item.title === title);
    if (itemIndex === -1) return;

    const item = allData[category][itemIndex];
    const currentlyFeaturedCount = Object.values(allData).flat().filter(i => i.featured).length;

    // Toggle the featured status
    const newFeaturedStatus = !item.featured;

    if (newFeaturedStatus && currentlyFeaturedCount >= maxFeatured) {
        setMessage(`You can only feature up to ${maxFeatured} ${type}.`);
        return;
    }

    // Create a new object for the item to ensure state updates correctly
    allData[category][itemIndex] = { ...item, featured: newFeaturedStatus };

    // Update the state to reflect the change immediately
    setData({ ...allData });

    try {
        await updateDoc(docRef, allData);
        setMessage('Featured item updated successfully!');
    } catch (error) {
        setMessage('Error updating featured item: ' + error.message);
        // Revert the change in UI if the update fails
        allData[category][itemIndex] = { ...item, featured: !newFeaturedStatus };
        setData({ ...allData });
    }
  };

  const renderSection = (title, data, type) => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-text">{title}</h3>
      <div className="p-4 bg-background rounded-md space-y-3 border border-white/10">
        {Object.keys(data).length === 0 ? <p className="text-muted">No {type} found.</p> : 
        Object.entries(data).map(([category, items]) => (
          <div key={category}>
            <h4 className="font-semibold text-lg text-primary">{category}</h4>
            <ul className="list-inside pl-4 space-y-2 mt-2">
              {items.map((item, index) => (
                <li key={index} className="flex items-center gap-4 py-1 text-muted">
                  <button onClick={() => handleToggleFeature(type, category, item.title)} className="focus:outline-none">
                    <FaStar className={`${item.featured ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'} transition-colors`} />
                  </button>
                  <span className="text-text">{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) return <div className="text-center text-muted">Loading featured content...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text">Manage Featured Content</h2>
      <p className="text-muted">Select up to 3 projects and 3 portfolio items to feature on the homepage.</p>
      {message && <p className={`text-center p-3 rounded-md ${message.includes('Error') ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderSection('Projects', projectsData, 'projects')}
        {renderSection('Portfolio', portfolioData, 'portfolio')}
      </div>
    </div>
  );
}
