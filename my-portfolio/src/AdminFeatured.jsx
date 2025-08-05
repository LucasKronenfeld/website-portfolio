import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaStar } from 'react-icons/fa';

const MAX_FEATURED = 3;

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

  const handleToggleFeature = async (type, category, index) => {
    let data, setData, docRef;
    if (type === 'projects') {
      data = { ...projectsData };
      setData = setProjectsData;
      docRef = doc(db, 'projects', 'data');
    } else {
      data = { ...portfolioData };
      setData = setPortfolioData;
      docRef = doc(db, 'portfolio', 'data');
    }

    const item = data[category][index];
    const currentlyFeatured = Object.values(data).flat().filter(i => i.isFeatured).length;

    if (!item.isFeatured && currentlyFeatured >= MAX_FEATURED) {
      setMessage(`You can only feature up to ${MAX_FEATURED} items.`);
      return;
    }

    item.isFeatured = !item.isFeatured;
    setData(data);

    try {
      await updateDoc(docRef, data);
      setMessage('Featured item updated successfully!');
      fetchData(); // Refresh data to ensure consistency
    } catch (error) {
      setMessage('Error updating featured item: ' + error.message);
    }
  };

  const renderSection = (title, data, type) => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-text">{title}</h3>
      <div className="p-4 bg-background rounded-md space-y-3">
        {Object.entries(data).map(([category, items]) => (
          <div key={category}>
            <h4 className="font-semibold text-lg text-text-secondary">{category}</h4>
            <ul className="list-disc list-inside pl-4">
              {items.map((item, index) => (
                <li key={index} className="flex items-center gap-4 py-1">
                  <button onClick={() => handleToggleFeature(type, category, index)}>
                    <FaStar className={item.isFeatured ? 'text-yellow-400' : 'text-gray-500'} />
                  </button>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text">Manage Featured Content</h2>
      <p>Select up to 3 projects and 3 portfolio items to feature on the homepage.</p>
      {message && <p className="text-center p-3 bg-gray-200 rounded-md text-gray-800">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderSection('Projects', projectsData, 'projects')}
        {renderSection('Portfolio', portfolioData, 'portfolio')}
      </div>
    </div>
  );
}
