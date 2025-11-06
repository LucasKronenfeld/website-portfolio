import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

// --- Shared Form Components ---
const FormInput = (props) => <input {...props} className="w-full p-2 bg-background border border-white/20 rounded-md text-text focus:ring-primary focus:border-primary" />;
const FormTextarea = (props) => <textarea {...props} className="w-full p-2 bg-background border border-white/20 rounded-md text-text focus:ring-primary focus:border-primary h-32" />;
const AddButton = ({ children, ...props }) => <button type="button" {...props} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition">{children}</button>;
const RemoveButton = ({ children, ...props }) => <button type="button" {...props} className="text-red-500 hover:text-red-400 transition font-semibold">{children}</button>;
const SaveButton = ({ children, ...props }) => <button {...props} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors">{children}</button>;

const initialResumeData = { "Summary": "", "Work Experience": [], "Projects": [], "Skills": {}, "Education": [], "Relevant Coursework": {}, "Volunteer Work": [] };
const orderedSections = ["Summary", "Work Experience", "Projects", "Skills", "Education", "Relevant Coursework", "Volunteer Work"];

export default function AdminResume() {
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [activeSection, setActiveSection] = useState('Summary');

    useEffect(() => {
        const fetchResumeData = async () => {
            const docRef = doc(db, 'resume', 'data');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setResumeData(docSnap.data());
            } else {
                await setDoc(docRef, initialResumeData);
                setResumeData(initialResumeData);
            }
            setLoading(false);
        };
        fetchResumeData();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('Updating...');
        try {
            await updateDoc(doc(db, 'resume', 'data'), resumeData);
            setMessage('Resume updated successfully!');
        } catch (error) {
            setMessage('Error updating resume.');
        }
    };

    const updateNestedState = (path, value) => {
        setResumeData(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            let current = newState;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;
            return newState;
        });
    };
    
    const handleAdd = (path, newItem) => {
        const currentItems = path.reduce((acc, key) => acc[key], resumeData) || [];
        updateNestedState(path, [...currentItems, newItem]);
    };

    const handleRemove = (path, index) => {
        const currentItems = path.reduce((acc, key) => acc[key], resumeData);
        updateNestedState(path, currentItems.filter((_, i) => i !== index));
    };

    const renderSectionEditor = () => {
        const data = resumeData[activeSection];
        switch (activeSection) {
            case 'Summary':
                return <FormTextarea value={data} onChange={e => updateNestedState(['Summary'], e.target.value)} />;

            case 'Work Experience':
            case 'Projects':
            case 'Volunteer Work':
                // Drag + drop reorder for array items
                return (
                    <DraggableItemsEditor
                        items={data}
                        sectionKey={activeSection}
                        onRemove={handleRemove}
                        onAdd={() => {
                            if (activeSection === 'Projects') {
                                handleAdd([activeSection], { title: "", description: "", link: "" });
                            } else {
                                handleAdd([activeSection], { title: "", role: "", duration: "", description: "" });
                            }
                        }}
                        onUpdateField={(index, field, value) => updateNestedState([activeSection, index, field], value)}
                        onReorder={(oldIndex, newIndex) => {
                            const updated = arrayMove(data, oldIndex, newIndex);
                            updateNestedState([activeSection], updated);
                        }}
                    />
                );
            
            case 'Education':
                 return (
                    <div className="space-y-4">
                        {data.map((item, index) => (
                            <div key={index} className="p-4 bg-background rounded-lg border border-white/10 flex items-center gap-4">
                               <FormInput value={item} onChange={e => updateNestedState([activeSection, index], e.target.value)} />
                               <RemoveButton onClick={() => handleRemove([activeSection], index)}>✕</RemoveButton>
                            </div>
                        ))}
                        <AddButton onClick={() => handleAdd([activeSection], "New School (Degree, Graduation Year)")}>Add Education</AddButton>
                    </div>
                );

            case 'Skills':
            case 'Relevant Coursework':
                return (
                    <div className="space-y-6">
                        {Object.entries(data).map(([category, items]) => (
                            <div key={category} className="p-4 bg-background rounded-lg border border-white/10">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-lg font-semibold text-primary">{category}</h4>
                                    <RemoveButton onClick={() => {
                                        const { [category]: _, ...rest } = resumeData[activeSection];
                                        updateNestedState([activeSection], rest);
                                    }}>Remove Category</RemoveButton>
                                </div>
                                <div className="space-y-2">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <FormInput value={item} onChange={e => updateNestedState([activeSection, category, index], e.target.value)} />
                                            <RemoveButton onClick={() => handleRemove([activeSection, category], index)}>✕</RemoveButton>
                                        </div>
                                    ))}
                                    <AddButton onClick={() => handleAdd([activeSection, category], "New Item")}>Add Item</AddButton>
                                </div>
                            </div>
                        ))}
                        <AddButton onClick={() => {
                            const newCat = prompt("Enter new category name:");
                            if (newCat) updateNestedState([activeSection, newCat], []);
                        }}>Add New Category</AddButton>
                    </div>
                );

            default:
                return <p className="text-muted">Select a section to begin editing.</p>;
        }
    };

    if (loading) return <div className="text-muted text-center p-8">Loading Resume Editor...</div>;

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-1/4">
                <ul className="space-y-1 sticky top-24">
                    {orderedSections.map(section => (
                        <li key={section}>
                            <button onClick={() => setActiveSection(section)} className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeSection === section ? "bg-primary text-white font-semibold" : "text-muted hover:bg-surface"}`}>
                                {section}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            <main className="w-full md:w-3/4">
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-text">Editing: {activeSection}</h3>
                        <SaveButton type="submit">Save All Changes</SaveButton>
                    </div>
                    {message && <p className="text-center p-3 rounded-md text-green-300 bg-green-900/50 text-sm">{message}</p>}
                    <AnimatePresence mode="wait">
                        <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                            {resumeData && renderSectionEditor()}
                        </motion.div>
                    </AnimatePresence>
                </form>
            </main>
        </div>
    );
}

// Sortable item wrapper for dnd-kit
function SortableItem({ id, children }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}

// Draggable editor for array items like Work Experience / Projects
function DraggableItemsEditor({ items, sectionKey, onRemove, onAdd, onUpdateField, onReorder }) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = items.findIndex((_, idx) => `item-${idx}` === active.id);
        const newIndex = items.findIndex((_, idx) => `item-${idx}` === over.id);
        if (oldIndex !== -1 && newIndex !== -1) onReorder(oldIndex, newIndex);
    };

    return (
        <div className="space-y-4">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map((_, idx) => `item-${idx}`)} strategy={verticalListSortingStrategy}>
                    {items.map((item, index) => (
                        <SortableItem key={`item-${index}`} id={`item-${index}`}>
                            <div className="p-4 bg-background rounded-lg border border-white/10 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted select-none">Drag to reorder</span>
                                    <RemoveButton onClick={() => onRemove([sectionKey], index)}>Remove Item</RemoveButton>
                                </div>
                                {Object.keys(item).map(key => (
                                    <div key={key}>
                                        <label className="capitalize text-sm text-muted block mb-1">{key}</label>
                                        <FormInput value={item[key]} onChange={e => onUpdateField(index, key, e.target.value)} />
                                    </div>
                                ))}
                            </div>
                        </SortableItem>
                    ))}
                </SortableContext>
            </DndContext>
            <AddButton onClick={onAdd}>Add {sectionKey.slice(0, -1)}</AddButton>
        </div>
    );
}
