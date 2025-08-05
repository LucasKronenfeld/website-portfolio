import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

const initialPortfolioData = {
    items: []
};

export default function AdminPortfolio() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const docRef = doc(db, 'portfolio', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPortfolioData(docSnap.data());
        } else {
          await setDoc(docRef, initialPortfolioData);
          setPortfolioData(initialPortfolioData);
          setMessage("Initialized portfolio. You can now add your items.");
        }
      } catch (error) {
        console.error('Error fetching or creating portfolio data:', error);
        setMessage('Error fetching portfolio data.');
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

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newItems = [...portfolioData.items];
    newItems[index][name] = value;
    setPortfolioData({ items: newItems });
  };

  const handleAddItem = () => {
    const newItem = { title: "", description: "", imageUrl: "", link: "" };
    setPortfolioData(prev => ({ items: [...(prev.items || []), newItem] }));
  };

  const handleRemoveItem = (index) => {
    setPortfolioData(prev => ({
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div>Loading Portfolio Editor...</div>;
  if (!portfolioData) return <div className="text-red-500">Error: Portfolio data could not be loaded.</div>;

  return (
    <form onSubmit={handleUpdate} className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-text">Edit Portfolio</h3>
          <button className="px-6 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-darkback transition-colors" type="submit">
            Save Portfolio
          </button>
        </div>
        {message && <p className="text-center p-3 bg-gray-200 rounded-md text-gray-800">{message}</p>}

        <div className="space-y-4">
          {portfolioData.items && portfolioData.items.map((item, index) => (
            <motion.div 
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-background rounded-md space-y-3 relative"
            >
               <button type="button" onClick={() => handleRemoveItem(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>
               <div>
                  <label className="capitalize text-sm font-medium">Title</label>
                  <input name="title" value={item.title} onChange={(e) => handleChange(e, index)} placeholder="Title" className="w-full p-2 border border-contrast rounded"/>
               </div>
                <div>
                  <label className="capitalize text-sm font-medium">Description</label>
                  <textarea name="description" value={item.description} onChange={(e) => handleChange(e, index)} placeholder="Description" className="w-full p-2 border border-contrast rounded h-24"/>
               </div>
               <div>
                  <label className="capitalize text-sm font-medium">Image URL</label>
                  <input name="imageUrl" value={item.imageUrl} onChange={(e) => handleChange(e, index)} placeholder="Image URL" className="w-full p-2 border border-contrast rounded"/>
                </div>
                <div>
                  <label className="capitalize text-sm font-medium">Link</label>
                  <input name="link" value={item.link} onChange={(e) => handleChange(e, index)} placeholder="Link" className="w-full p-2 border border-contrast rounded"/>
                </div>
            </motion.div>
          ))}
        </div>
        <button type="button" onClick={handleAddItem} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add New Portfolio Item</button>
    </form>
  );
}
