import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './components/ImageUpload';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Shared Form Components ---
const FormInput = (props) => <input {...props} className="w-full p-2 bg-background border border-white/20 rounded-md text-text focus:ring-primary focus:border-primary" />;
const FormSelect = (props) => <select {...props} className="w-full p-2 bg-background border border-white/20 rounded-md text-text focus:ring-primary focus:border-primary" />;
const AddButton = ({ children, ...props }) => <button type="button" {...props} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition">{children}</button>;
const RemoveButton = ({ children, ...props }) => <button type="button" {...props} className="text-red-500 hover:text-red-400 transition font-semibold">{children}</button>;
const SaveButton = ({ children, ...props }) => <button {...props} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors">{children}</button>;
const TabButton = ({ children, active, ...props }) => (
    <button type="button" {...props} className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors ${active ? 'border-primary text-primary' : 'border-transparent text-muted hover:border-gray-500 hover:text-text'}`}>
        {children}
    </button>
);

const projectFieldOrder = ['title', 'description', 'imageSrc', 'link', 'featured'];

// Sortable Item Component
function SortableProjectItem({ id, item, index, activeCategory, updateState, projectsData, allCategories, moveItemToCategory }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className="p-4 bg-background rounded-lg border border-white/10 space-y-3"
        >
            <div className="flex justify-between items-center gap-3">
                <button
                    type="button"
                    className="cursor-grab active:cursor-grabbing text-muted hover:text-primary transition p-2 touch-none"
                    {...attributes}
                    {...listeners}
                    title="Drag to reorder"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                </button>
                <h4 className="font-semibold text-lg text-primary flex-grow">
                    {item.title || `Item ${index + 1}`}
                </h4>
                <RemoveButton 
                    onClick={() => updateState([activeCategory], projectsData[activeCategory].filter((_, i) => i !== index))}
                >
                    Remove Item
                </RemoveButton>
            </div>
            
            {/* Category Dropdown */}
            <div>
                <label className="text-sm text-muted block mb-1">Move to Category</label>
                <FormSelect 
                    value={activeCategory} 
                    onChange={(e) => {
                        if (e.target.value !== activeCategory) {
                            moveItemToCategory(item, index, activeCategory, e.target.value);
                        }
                    }}
                >
                    {allCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </FormSelect>
            </div>

            {projectFieldOrder.map(field => (
                <div key={field}>
                    <label className="capitalize text-sm text-muted block mb-1">{field}</label>
                    {field === 'featured' ? (
                        <input 
                            type="checkbox" 
                            checked={item[field]} 
                            onChange={e => updateState([activeCategory, index, field], e.target.checked)} 
                            className="h-5 w-5 rounded bg-background border-white/20 text-primary focus:ring-primary"
                        />
                    ) : field === 'imageSrc' ? (
                        <ImageUpload 
                            currentUrl={item[field]} 
                            onUploadComplete={(url) => updateState([activeCategory, index, field], url)}
                            folder="projects"
                            label="Project Image"
                        />
                    ) : (
                        <FormInput 
                            value={item[field]} 
                            onChange={(e) => updateState([activeCategory, index, field], e.target.value)} 
                            placeholder={field} 
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default function AdminProjects() {
    const [projectsData, setProjectsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const fetchProjectsData = async () => {
            const docRef = doc(db, 'projects', 'data');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
                const data = docSnap.data();
                setProjectsData(data);
                if (!activeCategory) setActiveCategory(Object.keys(data)[0]);
            } else {
                await setDoc(docRef, { "Computer Science": [] });
                setProjectsData({ "Computer Science": [] });
                setActiveCategory("Computer Science");
            }
            setLoading(false);
        };
        fetchProjectsData();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('Updating...');
        try {
            await updateDoc(doc(db, 'projects', 'data'), projectsData);
            setMessage('Projects updated successfully!');
        } catch (error) {
            setMessage('Error updating projects.');
        }
    };
    
    const updateState = (path, value) => {
        setProjectsData(prev => {
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
        if (newCat && !projectsData[newCat]) {
            updateState([newCat], []);
            setActiveCategory(newCat);
        }
    };
    
    const handleRemoveCategory = (catToRemove) => {
        if (!confirm(`Are you sure you want to remove the category "${catToRemove}" and all its items?`)) return;
        const { [catToRemove]: _, ...rest } = projectsData;
        setProjectsData(rest);
        const remainingCats = Object.keys(rest);
        setActiveCategory(remainingCats.length > 0 ? remainingCats[0] : null);
    };

    const handleAddItem = (category) => {
        const newItem = { title: "", description: "", imageSrc: "", link: "", featured: false };
        const currentItems = projectsData[category] || [];
        updateState([category], [...currentItems, newItem]);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (!over || active.id === over.id) return;

        const activeIndex = parseInt(active.id.split('-')[1]);
        const overIndex = parseInt(over.id.split('-')[1]);

        const newItems = arrayMove(projectsData[activeCategory], activeIndex, overIndex);
        updateState([activeCategory], newItems);
    };

    const moveItemToCategory = (item, itemIndex, fromCategory, toCategory) => {
        setProjectsData(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            
            // Remove item from source category
            const removedItem = newState[fromCategory].splice(itemIndex, 1)[0];
            
            // Add item to destination category
            if (!newState[toCategory]) {
                newState[toCategory] = [];
            }
            newState[toCategory].push(removedItem);
            
            return newState;
        });
        
        // Optionally switch to the new category to see the moved item
        setActiveCategory(toCategory);
    };
    
    if (loading) return <div className="text-muted text-center p-8">Loading Projects Editor...</div>;
    
    return (
        <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-text">Edit Projects</h3>
                <SaveButton type="submit">Save Projects</SaveButton>
            </div>
             {message && <p className="text-center p-3 rounded-md text-green-300 bg-green-900/50 text-sm">{message}</p>}

            <div className="border-b border-white/10 flex justify-between items-center gap-4">
                <nav className="flex-grow flex space-x-2" aria-label="Category Tabs">
                    {projectsData && Object.keys(projectsData).map((cat) => (
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
                    {activeCategory && projectsData[activeCategory] ? (
                        <DndContext 
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext 
                                items={projectsData[activeCategory].map((_, index) => `project-${index}`)}
                                strategy={verticalListSortingStrategy}
                            >
                                {projectsData[activeCategory].map((item, index) => (
                                    <SortableProjectItem
                                        key={`project-${index}`}
                                        id={`project-${index}`}
                                        item={item}
                                        index={index}
                                        activeCategory={activeCategory}
                                        updateState={updateState}
                                        projectsData={projectsData}
                                        allCategories={Object.keys(projectsData)}
                                        moveItemToCategory={moveItemToCategory}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    ) : <p className="text-muted">Select a category to see its items.</p>}
                     {activeCategory && <AddButton onClick={() => handleAddItem(activeCategory)}>Add Item to {activeCategory}</AddButton>}
                </motion.div>
            </AnimatePresence>
        </form>
    );
}
