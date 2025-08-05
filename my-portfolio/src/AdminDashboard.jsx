import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AdminResume from './AdminResume';
import AdminPortfolio from './AdminPortfolio';
import AdminProjects from './AdminProjects';
import AdminPosts from './AdminPosts';
import AdminFeatured from './AdminFeatured'; // Import the new component

const sections = ['Featured', 'Posts', 'Resume', 'Portfolio', 'Projects'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Featured');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/admin');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setMessage('Error logging out: ' + error.message);
    }
  };
  
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'Featured':
        return <AdminFeatured />;
      case 'Resume':
        return <AdminResume />;
      case 'Portfolio':
        return <AdminPortfolio />;
      case 'Projects':
        return <AdminProjects />;
      case 'Posts':
      default:
        return <AdminPosts />;
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 border-b border-contrast">
          <h1 className="text-3xl font-bold text-text">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-primary hover:underline">&larr; Back to Site</Link>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        
        {message && <p className="my-4 text-center p-3 bg-gray-200 rounded-md text-gray-800">{message}</p>}

        <div className="border-b border-contrast">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {sections.map(section => (
              <button
                key={section}
                onClick={() => setActiveTab(section)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === section
                    ? 'border-secondary text-white'
                    : 'border-transparent text-text hover:border-gray-300'
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="py-8">
          <div className="bg-accent p-6 rounded-lg shadow-inner">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}
