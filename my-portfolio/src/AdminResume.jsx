import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function AdminResume() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const docRef = doc(db, 'resume', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setResumeData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching resume data:', error);
        setMessage('Error fetching resume data.');
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('Updating...');
    try {
      const docRef = doc(db, 'resume', 'data');
      await updateDoc(docRef, resumeData);
      setMessage('Resume data updated successfully!');
    } catch (error) {
      console.error('Error updating resume data:', error);
      setMessage('Error updating resume data.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, index, field] = name.split('.');
  
    setResumeData((prevData) => {
      const newData = { ...prevData };
      if (index !== undefined && field) {
        // Handle array of objects (Work Experience, Projects, Volunteer Work)
        newData[section][index][field] = value;
      } else if (index !== undefined) {
        // Handle array of strings (Education)
        newData[section][index] = value;
      } else {
        // Handle strings and objects (Summary, Skills, Relevant Coursework)
        newData[section] = value;
      }
      return newData;
    });
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-4 bg-accent p-4 rounded shadow">
      <h3 className="text-xl font-semibold">Edit Resume</h3>
      {message && <p className="text-center p-2 bg-gray-200 rounded">{message}</p>}
      
      <div>
        <label>Summary</label>
        <textarea
          name="Summary"
          value={resumeData.Summary || ''}
          onChange={handleChange}
          className="w-full p-2 border border-contrast rounded"
        />
      </div>

      {/* Add more fields for other sections as needed */}

      <button className="px-4 py-2 bg-secondary text-white rounded hover:bg-darkback" type="submit">
        Update Resume
      </button>
    </form>
  );
}
