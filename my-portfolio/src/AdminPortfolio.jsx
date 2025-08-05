import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const initialPortfolioData = {
    "Pixel": [], "2D": [], "Photography": []
};

export default function AdminPortfolio() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const docRef = doc(db, 'portfolio', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          const data = docSnap.data();
          setPortfolioData(data);
          setActiveCategoryTab(Object.keys(data)[0]);
        } else {
          await setDoc(docRef, initialPortfolioData);
          setPortfolioData(initialPortfolioData);
          setActiveCategoryTab(Object.keys(initialPortfolioData)[0]);
          setMessage("Initialized portfolio with your legacy data.");
        }
      } catch (error) {
        console.error('Error handling portfolio data:', error);
        setMessage('Error fetching or creating portfolio data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolioData();
  }, []);
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('Updating...');
    try {
      const docRef = doc(db, 'portfolio', 'data');
      await updateDoc(docRef, portfolioData);
      setMessage('Portfolio updated successfully!');
    } catch (error) {
      console.error('Error updating portfolio data:', error);
      setMessage('Error updating portfolio data.');
    }
  };
  
  const handleAddCategory = () => {
    const newCategoryName = prompt("Enter the name for the new category:");
    if (newCategoryName && !portfolioData[newCategoryName]) {
      const newData = { ...portfolioData, [newCategoryName]: [] };
      setPortfolioData(newData);
      setActiveCategoryTab(newCategoryName);
    }
  };
  
  const handleRemoveCategory = (catToRemove) => {
    if (!confirm(`Are you sure you want to remove the category "${catToRemove}" and all its items?`)) return;
    const { [catToRemove]: _, ...rest } = portfolioData;
    setPortfolioData(rest);
    const remainingTabs = Object.keys(rest);
    setActiveCategoryTab(remainingTabs.length > 0 ? remainingTabs[0] : null);
  };
  
  const handleItemChange = (cat, index, field, value) => {
    const data = { ...portfolioData };
    data[cat][index][field] = value;
    setPortfolioData(data);
  };

  const handleAddItemToCategory = (cat) => {
    const data = { ...portfolioData };
    data[cat] = [...data[cat], { imageUrl: "", title: "", description: "" }];
    setPortfolioData(data);
  };
  
  const handleRemoveItemFromCategory = (cat, index) => {
    const data = { ...portfolioData };
    data[cat] = data[cat].filter((_, i) => i !== index);
    setPortfolioData(data);
  };

  if (loading) return <div>Loading Portfolio Editor...</div>;
  if (!portfolioData) return <div className="text-red-500">Error: Portfolio data could not be loaded.</div>;

  return (
    <form onSubmit={handleUpdate} className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-text">Edit Portfolio</h3>
            <button className="px-6 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-darkback transition-colors" type="submit">
                Save All Portfolio Changes
            </button>
        </div>
        {message && <p className="text-center p-3 bg-gray-200 rounded-md text-gray-800">{message}</p>}

        <div className="border-b border-contrast flex justify-between items-center">
          <nav className="-mb-px flex space-x-6" aria-label="Category Tabs">
            {Object.keys(portfolioData).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategoryTab(category)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeCategoryTab === category
                    ? 'border-secondary text-white'
                    : 'border-transparent text-text hover:border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {activeCategoryTab && (
              <button type="button" onClick={() => handleRemoveCategory(activeCategoryTab)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Remove '{activeCategoryTab}'</button>
            )}
            <button type="button" onClick={handleAddCategory} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Add Category</button>
          </div>
        </div>
        
        <div className="space-y-4">
            {activeCategoryTab && portfolioData[activeCategoryTab] ? (
                portfolioData[activeCategoryTab].map((item, index) => (
                    <div key={index} className="p-4 bg-background rounded-md space-y-3 relative">
                        <button type="button" onClick={() => handleRemoveItemFromCategory(activeCategoryTab, index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>
                        <h4 className="font-semibold text-lg pr-8">{item.title || `Item ${index + 1}`}</h4>
                        {Object.keys(item).map(field => (
                            <div key={field}>
                                <label className="capitalize text-sm font-medium text-text">{field}</label>
                                <input value={item[field]} onChange={(e) => handleItemChange(activeCategoryTab, index, field, e.target.value)} placeholder={field} className="w-full p-2 border border-contrast rounded"/>
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <p>No category selected. Please add or select a category.</p>
            )}
            {activeCategoryTab && (
                 <button type="button" onClick={() => handleAddItemToCategory(activeCategoryTab)} className="px-3 py-1 mt-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">Add Item to {activeCategoryTab}</button>
            )}
        </div>
    </form>
  );
}
