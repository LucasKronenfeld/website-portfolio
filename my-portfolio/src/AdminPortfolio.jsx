import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './components/ImageUpload';

// --- Shared Form Components ---
const FormInput = (props) => <input {...props} className="w-full p-2 bg-background border border-white/20 rounded-md text-text focus:ring-primary focus:border-primary" />;
const AddButton = ({ children, ...props }) => <button type="button" {...props} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition">{children}</button>;
const RemoveButton = ({ children, ...props }) => <button type="button" {...props} className="text-red-500 hover:text-red-400 transition font-semibold">{children}</button>;
const SaveButton = ({ children, ...props }) => <button {...props} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors">{children}</button>;
const TabButton = ({ children, active, ...props }) => (
    <button type="button" {...props} className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors ${active ? 'border-primary text-primary' : 'border-transparent text-muted hover:border-gray-500 hover:text-text'}`}>
        {children}
    </button>
);

const portfolioFieldOrder = ['title', 'description', 'imageUrl', 'featured'];

export default function AdminPortfolio() {
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            const docRef = doc(db, 'portfolio', 'data');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
                const data = docSnap.data();
                setPortfolioData(data);
                if (!activeCategory) setActiveCategory(Object.keys(data)[0]);
            } else {
                await setDoc(docRef, { "Example Category": [] });
                setPortfolioData({ "Example Category": [] });
                setActiveCategory("Example Category");
            }
            setLoading(false);
        };
        fetchPortfolioData();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('Updating...');
        try {
            await updateDoc(doc(db, 'portfolio', 'data'), portfolioData);
            setMessage('Portfolio updated successfully!');
        } catch (error) {
            setMessage('Error updating portfolio.');
        }
    };
    
    const updateState = (path, value) => {
        setPortfolioData(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            let current = newState;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;
            return newState;
        });
    };

    const handleAddCategory = () => {
        const newCat = prompt("Enter new category name:");
        if (newCat && !portfolioData[newCat]) {
            updateState([newCat], []);
            setActiveCategory(newCat);
        }
    };
    
    const handleRemoveCategory = (catToRemove) => {
        if (!confirm(`Are you sure you want to remove the category "${catToRemove}" and all its items?`)) return;
        const { [catToRemove]: _, ...rest } = portfolioData;
        setPortfolioData(rest);
        const remainingCats = Object.keys(rest);
        setActiveCategory(remainingCats.length > 0 ? remainingCats[0] : null);
    };

    const handleAddItem = (category) => {
        const newItem = { title: "", description: "", imageUrl: "", featured: false };
        const currentItems = portfolioData[category] || [];
        updateState([category], [...currentItems, newItem]);
    };
    
    if (loading) return <div className="text-muted text-center p-8">Loading Portfolio Editor...</div>;
    
    return (
        <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-text">Edit Portfolio</h3>
                <SaveButton type="submit">Save Portfolio</SaveButton>
            </div>
             {message && <p className="text-center p-3 rounded-md text-green-300 bg-green-900/50 text-sm">{message}</p>}

            <div className="border-b border-white/10 flex justify-between items-center gap-4">
                <nav className="flex-grow flex space-x-2" aria-label="Category Tabs">
                    {portfolioData && Object.keys(portfolioData).map((cat) => (
                        <TabButton key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
                            {cat}
                        </TabButton>
                    ))}
                </nav>
                 <AddButton onClick={handleAddCategory}>Add Category</AddButton>
                 {activeCategory && <RemoveButton onClick={() => handleRemoveCategory(activeCategory)}>Remove '{activeCategory}'</RemoveButton>}
            </div>
            
            <AnimatePresence mode="wait">
                <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
                    {activeCategory && portfolioData[activeCategory] ? (
                        portfolioData[activeCategory].map((item, index) => (
                            <div key={index} className="p-4 bg-background rounded-lg border border-white/10 space-y-3">
                                <div className="flex justify-between items-center"><h4 className="font-semibold text-lg text-primary">{item.title || `Item ${index + 1}`}</h4><RemoveButton onClick={() => updateState([activeCategory], portfolioData[activeCategory].filter((_, i) => i !== index))}>Remove Item</RemoveButton></div>
                                {portfolioFieldOrder.map(field => (
                                    (item.hasOwnProperty(field)) && <div key={field}>
                                        <label className="capitalize text-sm text-muted block mb-1">{field}</label>
                                        {field === 'featured' ? (
                                            <input type="checkbox" checked={item[field]} onChange={e => updateState([activeCategory, index, field], e.target.checked)} className="h-5 w-5 rounded bg-background border-white/20 text-primary focus:ring-primary"/>
                                        ) : field === 'imageUrl' ? (
                                            <ImageUpload 
                                                currentUrl={item[field]} 
                                                onUploadComplete={(url) => updateState([activeCategory, index, field], url)}
                                                folder="portfolio"
                                                label="Portfolio Image"
                                            />
                                        ) : (
                                            <FormInput value={item[field]} onChange={(e) => updateState([activeCategory, index, field], e.target.value)} placeholder={field} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : <p className="text-muted">Select a category to see its items.</p>}
                     {activeCategory && <AddButton onClick={() => handleAddItem(activeCategory)}>Add Item to {activeCategory}</AddButton>}
                </motion.div>
            </AnimatePresence>
        </form>
    );
}
