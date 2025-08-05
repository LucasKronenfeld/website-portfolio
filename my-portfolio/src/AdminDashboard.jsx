import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AdminResume from './AdminResume';
import AdminPortfolio from './AdminPortfolio';
import AdminProjects from './AdminProjects';

const sections = ['Posts', 'Resume', 'Portfolio', 'Projects'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Posts');
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
      case 'Resume':
        return <AdminResume />;
      case 'Portfolio':
        return <AdminPortfolio />;
      case 'Projects':
        return <AdminProjects />;
      case 'Posts':
      default:
        // The existing Post management component will be re-integrated here.
        return <div>Posts Management Coming Soon</div>;
    }
  }

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
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
        
        {message && <p className="mb-4 text-center p-3 bg-gray-200 rounded-md text-gray-800">{message}</p>}

        <div className="flex flex-col sm:flex-row gap-6">
          {/* --- Left Navigation --- */}
          <div className="sm:w-1/4 bg-contrast p-4 rounded-lg shadow-lg self-start">
            <h2 className="text-xl font-bold text-white mb-4">Management</h2>
            <ul>
              {sections.map(section => (
                <li key={section}>
                  <button
                    onClick={() => setActiveTab(section)}
                    className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition ${activeTab === section ? "bg-secondary text-white" : "text-white hover:bg-darkback"}`}
                  >
                    {section}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Right Content Area --- */}
          <div className="sm:w-3/4 bg-accent p-6 rounded-lg shadow-inner">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}
