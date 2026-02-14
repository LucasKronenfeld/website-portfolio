import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { db, storage } from './firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// --- Shared Form Components ---
const FormInput = (props) => <input {...props} className="w-full p-2 bg-background border border-white/20 rounded-md text-text focus:ring-primary focus:border-primary" />;
const FormTextarea = (props) => <textarea {...props} className="w-full p-2 bg-background border border-white/20 rounded-md text-text focus:ring-primary focus:border-primary h-32" />;
const AddButton = ({ children, ...props }) => <button type="button" {...props} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition">{children}</button>;
const RemoveButton = ({ children, ...props }) => <button type="button" {...props} className="text-red-500 hover:text-red-400 transition font-semibold">{children}</button>;
const SaveButton = ({ children, ...props }) => <button {...props} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors">{children}</button>;

const initialResumeData = { "Summary": "", "Work Experience": [], "Projects": [], "Skills": {}, "Education": [], "Relevant Coursework": {}, "Volunteer Work": [] };
const orderedSections = ["1-Page Resume PDF", "Summary", "Work Experience", "Projects", "Skills", "Education", "Relevant Coursework", "Volunteer Work"];

export default function AdminResume() {
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [activeSection, setActiveSection] = useState('1-Page Resume PDF');
    const [pdfUrl, setPdfUrl] = useState('');
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [pdfError, setPdfError] = useState('');
    const [pdfNumPages, setPdfNumPages] = useState(0);
    const [pdfWidth, setPdfWidth] = useState(600);
    const pdfContainerRef = useRef(null);

    useEffect(() => {
        const fetchResumeData = async () => {
            const docRef = doc(db, 'resume', 'data');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setResumeData(data);
                setPdfUrl(data.pdfUrl || '');
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
            await updateDoc(doc(db, 'resume', 'data'), { ...resumeData, pdfUrl });
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

    const handlePdfUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setPdfError('Please upload a PDF file.');
            return;
        }
        setUploadingPdf(true);
        setPdfError('');
        try {
            const storageRef = ref(storage, 'resume/one-page-resume.pdf');
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setPdfUrl(downloadURL);
            await updateDoc(doc(db, 'resume', 'data'), { pdfUrl: downloadURL });
            setMessage('PDF uploaded successfully!');
        } catch (err) {
            console.error('PDF upload error:', err);
            setPdfError('Error uploading PDF: ' + err.message);
        } finally {
            setUploadingPdf(false);
        }
    };

    const handlePdfRemove = async () => {
        try {
            const storageRef = ref(storage, 'resume/one-page-resume.pdf');
            await deleteObject(storageRef);
            setPdfUrl('');
            await updateDoc(doc(db, 'resume', 'data'), { pdfUrl: '' });
            setMessage('PDF removed.');
        } catch (err) {
            console.error('PDF delete error:', err);
            setPdfError('Error removing PDF: ' + err.message);
        }
    };

    useEffect(() => {
        if (!pdfContainerRef.current || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect?.width;
            if (width) setPdfWidth(Math.floor(width));
        });
        observer.observe(pdfContainerRef.current);
        return () => observer.disconnect();
    }, [pdfUrl]);

    const renderSectionEditor = () => {
        if (activeSection === '1-Page Resume PDF') {
            return (
                <div className="space-y-4 overflow-hidden" ref={pdfContainerRef}>
                    <p className="text-sm text-muted">Upload a 1-page PDF resume. This will be displayed at the top of your Resume page.</p>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <label className="flex-1">
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handlePdfUpload}
                                disabled={uploadingPdf}
                                className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 disabled:opacity-50"
                            />
                        </label>
                        <div className="flex gap-2 flex-shrink-0">
                            {pdfUrl && (
                                <>
                                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition">
                                        Open PDF
                                    </a>
                                    <button
                                        type="button"
                                        onClick={handlePdfRemove}
                                        className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                                    >
                                        Remove
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    {uploadingPdf && <p className="text-sm text-blue-400">Uploading PDF...</p>}
                    {pdfError && <p className="text-sm text-red-400">{pdfError}</p>}
                    {pdfUrl && (
                        <div className="mt-2">
                            <p className="text-sm text-green-400 mb-3">&#10003; PDF uploaded</p>
                            <Document
                                file={pdfUrl}
                                onLoadSuccess={({ numPages }) => setPdfNumPages(numPages)}
                                loading={<p className="text-muted">Loading PDF preview...</p>}
                                error={<p className="text-red-400">Could not load PDF preview.</p>}
                            >
                                {Array.from({ length: pdfNumPages }, (_, i) => (
                                    <div key={`admin-page-${i + 1}`} className="flex justify-center mb-4">
                                        <Page
                                            pageNumber={i + 1}
                                            width={pdfWidth - 2}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            className="rounded border border-white/10 shadow-sm [&_canvas]:!w-full [&_canvas]:!h-auto"
                                        />
                                    </div>
                                ))}
                            </Document>
                        </div>
                    )}
                </div>
            );
        }

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
