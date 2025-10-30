import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AdminResume from './AdminResume';
import AdminPortfolio from './AdminPortfolio';
import AdminProjects from './AdminProjects';
import AdminPosts from './AdminPosts';
import AdminFeatured from './AdminFeatured';

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
    <div className="bg-background min-h-screen text-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 sm:py-6 border-b border-white/10">
          <h1 className="text-2xl sm:text-3xl font-bold text-text">Admin Dashboard</h1>
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link to="/" className="text-xs sm:text-sm text-primary hover:underline">&larr; Back to Site</Link>
            <button 
              onClick={handleLogout} 
              className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base flex-1 sm:flex-initial"
            >
              Logout
            </button>
          </div>
        </div>
        
        {message && <p className="my-4 text-center p-3 bg-surface rounded-md text-text text-sm sm:text-base">{message}</p>}

        <div className="border-b border-white/10 overflow-x-auto scrollbar-hide">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 px-1" aria-label="Tabs">
            {sections.map(section => (
              <button
                key={section}
                onClick={() => setActiveTab(section)}
                className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors ${
                  activeTab === section
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted hover:border-gray-500 hover:text-text'
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="py-6 sm:py-8">
          <div className="bg-surface p-4 sm:p-6 rounded-lg shadow-inner border border-white/10">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}
