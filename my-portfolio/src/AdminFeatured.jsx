import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import ImageUpload from './components/ImageUpload';
import { FaStar } from 'react-icons/fa';

const MAX_FEATURED_PROJECTS = 4;
const MAX_FEATURED_PORTFOLIO = 4;

export default function AdminFeatured() {
  const [projectsData, setProjectsData] = useState({});
  const [portfolioData, setPortfolioData] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [homeSettings, setHomeSettings] = useState({
    bio_short: '',
    featured_role: '',
    featured_university: '',
    featured_hobbies: [], // array of { iconUrl, label }
    featured_quote: '',
    now_learning: [],
    location: '',
  });
  const [homeSaveMsg, setHomeSaveMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const projectsSnap = await getDoc(doc(db, 'projects', 'data'));
      if (projectsSnap.exists()) setProjectsData(projectsSnap.data());

      const portfolioSnap = await getDoc(doc(db, 'portfolio', 'data'));
      if (portfolioSnap.exists()) setPortfolioData(portfolioSnap.data());

      const homeSnap = await getDoc(doc(db, 'site', 'home'));
      if (homeSnap.exists()) {
        const data = homeSnap.data();
        const hobbies = Array.isArray(data.featured_hobbies) ? data.featured_hobbies.map(h => {
          if (typeof h === 'string') return { label: h, iconUrl: '' };
          return { label: h.label || '', iconUrl: h.iconUrl || h.icon || '' };
        }) : [];
        setHomeSettings({
          bio_short: data.bio_short || '',
          featured_role: data.featured_role || '',
          featured_university: data.featured_university || '',
          featured_hobbies: hobbies,
          featured_quote: data.featured_quote || '',
          now_learning: Array.isArray(data.now_learning) ? data.now_learning : [],
          location: data.location || '',
        });
      }

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
        {Object.keys(data).filter(k => k !== '_categoryOrder').length === 0 ? <p className="text-muted">No {type} found.</p> : 
        Object.entries(data).filter(([key]) => key !== '_categoryOrder').map(([category, items]) => (
          <div key={category}>
            <h4 className="font-semibold text-lg text-primary">{category}</h4>
            <ul className="list-inside pl-4 space-y-2 mt-2">
              {items.filter(item => !item.archived).map((item, index) => (
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

  const handleFieldChange = (field, value) => {
    setHomeSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setHomeSettings(prev => {
      const arr = Array.isArray(prev[field]) ? [...prev[field]] : [];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const handleArrayAdd = (field, emptyValue = '') => {
    setHomeSettings(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), emptyValue]
    }));
  };

  const handleArrayRemove = (field, index) => {
    setHomeSettings(prev => {
      const arr = Array.isArray(prev[field]) ? [...prev[field]] : [];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleLinkChange = (index, key, value) => {
    // No-op: featured_links removed
  };

  const saveHomeSettings = async () => {
    try {
      const ref = doc(db, 'site', 'home');
      await setDoc(ref, homeSettings, { merge: true });
      setHomeSaveMsg('Saved!');
      setTimeout(() => setHomeSaveMsg(''), 2500);
    } catch (error) {
      setHomeSaveMsg('Error: ' + error.message);
    }
  };

  const renderHomepageSettings = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-text">Homepage Content</h3>
      <div className="p-4 bg-background rounded-md border border-white/10 space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Featured Role</label>
          <input
            type="text"
            value={homeSettings.featured_role}
            onChange={(e) => handleFieldChange('featured_role', e.target.value)}
            className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-text"
            placeholder="e.g., Full-Stack Developer"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">University</label>
          <input
            type="text"
            value={homeSettings.featured_university}
            onChange={(e) => handleFieldChange('featured_university', e.target.value)}
            className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-text"
            placeholder="e.g., University of XYZ"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Location</label>
          <input
            type="text"
            value={homeSettings.location}
            onChange={(e) => handleFieldChange('location', e.target.value)}
            className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-text"
            placeholder="e.g., Columbus, OH"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Short Bio</label>
          <textarea
            value={homeSettings.bio_short}
            onChange={(e) => handleFieldChange('bio_short', e.target.value)}
            className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-text min-h-[88px]"
            placeholder="A one or two-sentence bio for the homepage"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Quote</label>
          <input
            type="text"
            value={homeSettings.featured_quote}
            onChange={(e) => handleFieldChange('featured_quote', e.target.value)}
            className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-text"
            placeholder="Optional personal quote"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-2">Hobbies / Interests</label>
          <div className="space-y-3">
            {(homeSettings.featured_hobbies || []).map((hob, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-start">
                <div className="sm:col-span-2">
                  <ImageUpload 
                    currentUrl={hob?.iconUrl || ''}
                    onUploadComplete={(url) => handleArrayChange('featured_hobbies', idx, { ...(hob || {}), iconUrl: url })}
                    folder="hobbies"
                    label="Icon Image"
                  />
                </div>
                <input
                  type="text"
                  value={hob?.label || ''}
                  onChange={(e) => handleArrayChange('featured_hobbies', idx, { ...(hob || {}), label: e.target.value })}
                  className="sm:col-span-3 bg-surface border border-white/10 rounded px-3 py-2 text-text"
                  placeholder="Hobby label"
                />
                <div className="sm:col-span-5 flex justify-end">
                  <button type="button" onClick={() => handleArrayRemove('featured_hobbies', idx)} className="px-3 py-2 bg-red-600/20 text-red-300 rounded border border-red-600/30">Remove</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => handleArrayAdd('featured_hobbies', { iconUrl: '', label: '' })} className="px-3 py-2 bg-primary/20 text-primary rounded border border-primary/30">+ Add Hobby</button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-2">Now Learning</label>
          <div className="space-y-2">
            {(homeSettings.now_learning || []).map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('now_learning', idx, e.target.value)}
                  className="flex-1 bg-surface border border-white/10 rounded px-3 py-2 text-text"
                  placeholder="e.g., Rust, Three.js, ML basics"
                />
                <button type="button" onClick={() => handleArrayRemove('now_learning', idx)} className="px-3 py-2 bg-red-600/20 text-red-300 rounded border border-red-600/30">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => handleArrayAdd('now_learning', '')} className="px-3 py-2 bg-primary/20 text-primary rounded border border-primary/30">+ Add Item</button>
          </div>
        </div>

        {/* featured_interests and featured_links removed per request */}

        <div className="pt-2 flex items-center gap-3">
          <button onClick={saveHomeSettings} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">Save Homepage Content</button>
          {homeSaveMsg && (
            <span className={`text-sm ${homeSaveMsg.startsWith('Error') ? 'text-red-300' : 'text-green-300'}`}>{homeSaveMsg}</span>
          )}
        </div>
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
      {renderHomepageSettings()}
    </div>
  );
}
