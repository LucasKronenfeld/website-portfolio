import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const initialPortfolioData = {
    "Pixel": [
      { imageUrl: "/pixel/pixelPenguin.png", title: "Pixel Penguin", description: "A pixel art piece." },
      { imageUrl: "/pixel/pixilPanda.png", title: "Pixel Panda", description: "A pixel art piece." },
      { imageUrl: "/pixel/pixilOrchid.png", title: "Pixel Orchid", description: "A pixel art piece." },
      { imageUrl: "/pixel/pixelBus.png", title: "Pixel Bus", description: "A pixel art piece." },
      { imageUrl: "/pixel/pixelCLE.png", title: "Pixel Cleveland", description: "A pixel art piece." },
      { imageUrl: "/pixel/pixelCamp.png", title: "Pixel Camp", description: "A pixel art piece." },
      { imageUrl: "/pixel/pixilBall.png", title: "Pixel Ball", description: "A pixel art piece." },
      { imageUrl: "/pixel/pixilPot.png", title: "Pixel Pot", description: "A pixel art piece." },
      { imageUrl: "/pixel/pixilWave.png", title: "Pixel Wave", description: "A pixel art piece." },
    ],
    "2D": [
      { imageUrl: "/TwoDArt/chase.jpg", title: "Lucas and Charles", description: "A 2D artwork." },
      { imageUrl: "/TwoDArt/lucasLogoman.png", title: "Logoman", description: "A 2D artwork." },
      { imageUrl: "/TwoDArt/abstractArt1.jpg", title: "Abstract Art", description: "A 2D artwork." },
      { imageUrl: "/TwoDArt/jakob.jpg", title: "Jakob", description: "A 2D artwork." },
      { imageUrl: "/TwoDArt/plew.JPG", title: "Zion", description: "A 2D artwork." },
      { imageUrl: "/TwoDArt/Edward.jpg", title: "Edward", description: "A 2D artwork." },
      { imageUrl: "/TwoDArt/Jamari.jpg", title: "Jamari", description: "A 2D artwork." },
      { imageUrl: "/TwoDArt/Salvatore.jpg", title: "Salvatore", description: "A 2D artwork." },
      { imageUrl: "/TwoDArt/leko.jpg", title: "Leko", description: "A 2D artwork." },
      { imageUrl: "/TwoDArt/LekoGray.jpg", title: "Leko Portrait", description: "A 2D artwork." },
    ],
    "Photography": [
      { imageUrl: "/modernDeskWork.png", title: "Modern Desk Work", description: "A beautiful shot." },
      { imageUrl: "/deskWorks.svg", title: "Desk Works", description: "Another great shot." },
    ],
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
        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          setPortfolioData(docSnap.data());
        } else {
          await setDoc(docRef, initialPortfolioData);
          setPortfolioData(initialPortfolioData);
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

  const handleCategoryChange = (oldCat, newCat) => {
     if (oldCat === newCat || !newCat) return;
     const data = { ...portfolioData };
     data[newCat] = data[oldCat];
     delete data[oldCat];
     setPortfolioData(data);
  };
  
  const handleItemChange = (cat, index, field, value) => {
    const data = { ...portfolioData };
    data[cat][index][field] = value;
    setPortfolioData(data);
  };

  const handleAddCategory = () => {
    const newCategoryName = prompt("Enter the name for the new category:");
    if (newCategoryName && !portfolioData[newCategoryName]) {
      setPortfolioData(prev => ({ ...prev, [newCategoryName]: [] }));
    }
  };
  
  const handleRemoveCategory = (cat) => {
    if (!confirm(`Are you sure you want to remove the category "${cat}"?`)) return;
    const data = { ...portfolioData };
    delete data[cat];
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
    <form onSubmit={handleUpdate} className="space-y-8">
        <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-text">Edit Portfolio</h3>
            <button className="px-6 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-darkback transition-colors" type="submit">
                Save All Portfolio Changes
            </button>
        </div>
        {message && <p className="text-center p-3 bg-gray-200 rounded-md text-gray-800">{message}</p>}

        <div className="space-y-6">
            {Object.entries(portfolioData).map(([category, items]) => (
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
