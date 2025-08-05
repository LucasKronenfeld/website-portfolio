import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

// This data will be uploaded to your database ONCE, the first time the admin resume page is loaded.
// After that, all data will be managed directly from the database.
const initialResumeData = {
    "Summary": "Highly motivated Computer Engineering student with a strong academic record and hands-on experience in IT support, management, and sales. Proven ability to lead teams, solve complex technical problems, and drive customer satisfaction. Seeking opportunities to leverage technical skills and leadership experience in a challenging engineering role.",
  
  "Work Experience": [
    { title: "Ohio State Athletics Dept.", role: "IT Helpdesk Technical Support Specialist", duration: "September 2023 - Present", description: "Troubleshoot and resolve software and hardware issues for professional coaches. Manage technology for live broadcasts during football and basketball games, ensuring seamless operations. Gained hands-on experience with CrowdStrike and various Microsoft products at a commercial level." },
    { title: "Solon Recreation Camp", role: "Camp Director", duration: "June 2024 - August 2024", description: "Directed a team of 70 counselors, managed activities for 450 campers. Implemented discipline strategies to reduce camper incidents." },
    { title: "Home Depot", role: "Sales Associate", duration: "May 2022 - June 2024", description: "Achieved sales targets, contributing to a revenue increase. Enhanced customer experience through expert product knowledge." },
    { title: "Birdigo and Elle Restaurant", role: "Food Service Associate", duration: "August 2021 - August 2022", description: "Managed point-of-sale systems and improved customer satisfaction scores through effective issue resolution." },
    { title: "Everything Lacrosse", role: "Founder and Manager", duration: "June 2021 - August 2021", description: "Launched and managed a successful lacrosse camp with a 100% satisfaction rate. Recruited and trained a team of coaches." },
    { title: "Backyard Camp", role: "Founder and Manager", duration: "June 2020 - August 2020", description: "Successfully launched a summer camp during COVID-19 with over 20 signups. Managed 5 counselors, created a safe and engaging environment." },
  ],

  "Projects": [
    { title: "Portfolio Website", description: "Personal portfolio showcasing skills and projects.", link: "https://github.com/LucasKronenfeld/website-portfolio" },
    { title: "Dentist Database creation", description: "design database and queries for a dentist office", link: "https://github.com/LucasKronenfeld/SQL-Project" },
    { title: "Pixel Tees Store", description: "E-commerce website for selling t-shirts. (payment system shut down).", link: "https://pixeltees.org" },

  ],

  "Skills": {
    "Programming Languages": ["Assembly", "Python", "C", "C++", "Java", "JavaScript", "HTML", "CSS", "MATLAB", "Swift"],
    "Web Development": ["HTML", "JavaScript", "CSS", "Web App Development", "React", "Vite", "Tailwind CSS"],
    "Software": ["XCode", "Microsoft Office Suite", "Eclipse", "Visual Studio Code"],
    "Databases": ["SQL", "Database Design"],
    "Creative": ["2D Art", "Digital Design"],
    "Testing & Tools": ["J-Unit Testing", "MATLAB", "CrowdStrike", "Microsoft Office Suite"],
    "Networking": ["Network Design", "Troubleshooting"]
  },

  "Education": [
    "The Ohio State University (Computer Engineering, Honors Program, GPA: 3.97, Expected Graduation: December 2025)",
    "Solon High School (Graduated 2022, GPA: 4.45, National Honors Society)"
  ],

  "Relevant Coursework": {
    "Software Engineering": ["Software I", "Software II", "Web App Development", "Discrete Math", "Principal of Programming Languages", "Intro to AI"],
    "Architecture": ["Systems I", "Systems II", "Analog Systems and Circuit Design", "Digital Logic"],
    "Networking & Databases": ["Computer Networking", "Database Systems"],
    "Engineering": ["Fundamental Engineering (Honors)", "Statistics", "Calculus", "Software Engineering", "Computer Engineering Ethics"],
    "Communication and Buissness": ["Entrepreneurship", "Communication technology", "Persuasive Communication", "Violence in Media", "Media and Citizenship", "Introduction to Humanities"],
    "Creative Design": ["2D Design"],
  },

  "Volunteer Work": [
    { title: "Solon Laccrose", role: "Head/Assistant Coach", duration: "2021 - 2024", description: "Volunteered to help coach a few teams in my free time" },
    { title: "Solon Recreation Center", role: "Head Coach", duration: "2018 - 2022", description: "Led teams to several league championships." },
    { title: "Solon High School", role: "Peer Tutor", duration: "2021 - 2022", description: "Tutored peers, improving grades by an average of 10%." }
  ]
};

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
          // If the document doesn't exist, create it with the initial data.
          await setDoc(docRef, initialResumeData);
          setResumeData(initialResumeData);
          setMessage("Created a new resume document with your initial data. You can now edit it.");
        }
      } catch (error) {
        console.error('Error fetching or creating resume data:', error);
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
    const path = name.split('.');
    
    setResumeData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy for safety
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const handleJsonChange = (e, section) => {
    const { value } = e.target;
     try {
        const parsedValue = JSON.parse(value);
        setResumeData(prevData => ({
            ...prevData,
            [section]: parsedValue
        }));
        setMessage("JSON format is correct.");
    } catch (error) {
        setMessage("Error: Invalid JSON format. Please correct it before saving.");
    }
  }

  if (loading) {
    return <div>Loading Resume Editor...</div>;
  }

  if (!resumeData) {
    return <div className="text-red-500">Error: Resume data could not be loaded. Please check the console for errors and ensure you are connected to Firestore.</div>;
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-6 bg-accent p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-text">Edit Resume</h3>
      {message && <p className="text-center p-3 bg-gray-200 rounded-md text-gray-800">{message}</p>}
      
      {/* --- Summary --- */}
      <div className="space-y-2">
        <label className="text-lg font-semibold text-text">Summary</label>
        <textarea
          name="Summary"
          value={resumeData.Summary || ''}
          onChange={handleChange}
          className="w-full p-3 border border-contrast rounded-md h-32"
        />
      </div>

      {/* --- Work Experience --- */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-text">Work Experience</h4>
        {resumeData['Work Experience'] && resumeData['Work Experience'].map((item, index) => (
          <div key={index} className="p-4 border border-dashed border-contrast rounded-md space-y-2">
            <input name={`Work Experience.${index}.title`} value={item.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border border-contrast rounded"/>
            <input name={`Work Experience.${index}.role`} value={item.role} onChange={handleChange} placeholder="Role" className="w-full p-2 border border-contrast rounded"/>
            <input name={`Work Experience.${index}.duration`} value={item.duration} onChange={handleChange} placeholder="Duration" className="w-full p-2 border border-contrast rounded"/>
            <textarea name={`Work Experience.${index}.description`} value={item.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border border-contrast rounded h-24"/>
          </div>
        ))}
      </div>
      
      {/* --- Projects --- */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-text">Projects</h4>
        {resumeData.Projects && resumeData.Projects.map((item, index) => (
          <div key={index} className="p-4 border border-dashed border-contrast rounded-md space-y-2">
            <input name={`Projects.${index}.title`} value={item.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border border-contrast rounded"/>
            <input name={`Projects.${index}.link`} value={item.link} onChange={handleChange} placeholder="Link" className="w-full p-2 border border-contrast rounded"/>
            <textarea name={`Projects.${index}.description`} value={item.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border border-contrast rounded h-24"/>
          </div>
        ))}
      </div>
      
      {/* --- Education --- */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-text">Education</h4>
        {resumeData.Education && resumeData.Education.map((item, index) => (
            <input key={index} name={`Education.${index}`} value={item} onChange={handleChange} placeholder="Education Entry" className="w-full p-2 border border-contrast rounded"/>
        ))}
      </div>
      
      {/* --- Volunteer Work --- */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-text">Volunteer Work</h4>
        {resumeData['Volunteer Work'] && resumeData['Volunteer Work'].map((item, index) => (
          <div key={index} className="p-4 border border-dashed border-contrast rounded-md space-y-2">
            <input name={`Volunteer Work.${index}.title`} value={item.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border border-contrast rounded"/>
            <input name={`Volunteer Work.${index}.role`} value={item.role} onChange={handleChange} placeholder="Role" className="w-full p-2 border border-contrast rounded"/>
            <input name={`Volunteer Work.${index}.duration`} value={item.duration} onChange={handleChange} placeholder="Duration" className="w-full p-2 border border-contrast rounded"/>
            <textarea name={`Volunteer Work.${index}.description`} value={item.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border border-contrast rounded h-24"/>
          </div>
        ))}
      </div>

      {/* --- Skills & Coursework (JSON editor) --- */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-text">Skills (Edit in JSON format)</h4>
         <textarea
            value={JSON.stringify(resumeData.Skills, null, 2)}
            onChange={(e) => handleJsonChange(e, 'Skills')}
            className="w-full p-3 border border-contrast rounded-md h-48 font-mono"
          />
      </div>
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-text">Relevant Coursework (Edit in JSON format)</h4>
         <textarea
            value={JSON.stringify(resumeData['Relevant Coursework'], null, 2)}
            onChange={(e) => handleJsonChange(e, 'Relevant Coursework')}
            className="w-full p-3 border border-contrast rounded-md h-48 font-mono"
          />
      </div>

      <button className="w-full px-6 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-darkback transition-colors" type="submit">
        Save All Resume Changes
      </button>
    </form>
  );
}
