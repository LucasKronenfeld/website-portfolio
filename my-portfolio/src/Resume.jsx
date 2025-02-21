import { useState } from "react";

const sections = [
  "Full Resume", "Summary", "Work Experience", "Projects", "Skills", "Education", "Relevant Coursework", "Volunteer Work"
];

const resumeData = {
  "Summary": "Highly motivated Computer Engineering student with a strong academic record and hands-on experience in IT support, management, and sales. Proven ability to lead teams, solve complex technical problems, and drive customer satisfaction. Seeking opportunities to leverage technical skills and leadership experience in a challenging engineering role.",
  
  "Work Experience": [
    { title: "Ohio State Athletics Dept.", role: "IT Helpdesk Technical Support Specialist", duration: "September 2023 - Present", description: "Troubleshoot and resolve software and hardware issues for professional coaches. Manage technology for live broadcasts during football and basketball games, ensuring seamless operations. Gained hands-on experience with CrowdStrike and various Microsoft products at a commercial level." },
    { title: "Solon Recreation Camp", role: "Camp Director", duration: "June 2024 - August 2024", description: "Directed a team of 70 counselors, managed activities for 450 campers. Implemented discipline strategies to reduce camper incidents." },
    { title: "Home Depot", role: "Sales Associate", duration: "May 2022 - June 2024", description: "Achieved sales targets, contributing to a revenue increase. Enhanced customer experience through expert product knowledge." }
  ],

  "Projects": [
    { title: "Pixel Tees Store", description: "E-commerce website for selling t-shirts. (payment system shut down).", link: "https://pixeltees.org" },
    { title: "Portfolio Website", description: "Personal portfolio showcasing skills and projects.", link: "https://lucaskronenfeld.com" }
  ],

  "Skills": {
    "Programming Languages": ["Assembly", "Python", "C", "C++", "Java", "JavaScript", "HTML", "CSS", "MATLAB"],
    "Web Development": ["HTML", "JavaScript", "CSS", "Web App Development"],
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
    "Software Engineering": ["Software I", "Software II", "Web App Development", "Discrete Math"],
    "Architecture": ["Systems I", "Systems II", "Analog Systems and Circuit Design", "Digital Logic"],
    "Networking & Databases": ["Computer Networking", "Database Systems"],
    "Engineering": ["Fundamental Engineering (Honors)", "Statistics", "Calculus"],
    "Creative Design": ["2D Design"]
  },

  "Volunteer Work": [
    { title: "Solon Recreation Center", role: "Head Coach", duration: "2018 - 2022", description: "Led teams to several league championships." },
    { title: "Solon High School", role: "Peer Tutor", duration: "2021 - 2022", description: "Tutored peers, improving grades by an average of 10%." }
  ]
};

export default function Resume() {
  const [activeSection, setActiveSection] = useState("Full Resume");

  return (
    <div className="min-h-screen bg-background p-8 flex">
      <div className="w-1/4 bg-contrast p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Sections</h2>
        <ul>
          {sections.map(section => (
            <li key={section}>
              <button
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition ${activeSection === section ? "bg-secondary text-white" : "text-white hover:bg-darkback"}`}
              >
                {section}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={`w-3/4 p-6 bg-white rounded-lg shadow-lg ml-4 overflow-y-auto max-h-screen ${activeSection === "Full Resume" ? "text-black" : ""}`}>
        <h1 className="text-3xl font-bold text-text mb-4">{activeSection}</h1>

        {activeSection === "Full Resume" ? (
          <div className="overflow-y-auto max-h-screen p-4">
            {sections.slice(1).map(section => (
              <div key={section} className="mb-6">
                <h2 className="text-xl font-bold mb-2">{section}</h2>
                {section === "Skills" || section === "Relevant Coursework" ? (
                  Object.entries(resumeData[section]).map(([category, items], index) => (
                    <div key={index} className="mb-4">
                      <h3 className="text-lg font-semibold mb-1">{category}</h3>
                      <p>{items.join(", ")}</p>
                    </div>
                  ))
                ) : Array.isArray(resumeData[section]) ? (
                  <ul>
                    {resumeData[section].map((item, index) => (
                      <li key={index} className="mb-4">
                        {typeof item === "string" ? (
                          <p className="text-lg">{item}</p>
                        ) : (
                          <>
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            {item.role && <p className="text-sm text-gray-600">{item.role} ({item.duration})</p>}
                            <p className="mt-2">{item.description}</p>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="whitespace-pre-wrap text-lg">{resumeData[section]}</p>
                )}
              </div>
            ))}
          </div>
        ) : activeSection === "Skills" || activeSection === "Relevant Coursework" ? (
          <div>
            {Object.entries(resumeData[activeSection]).map(([category, items], index) => (
              <div key={index} className="mb-4">
                <h2 className="text-xl font-semibold mb-2">{category}</h2>
                <div className="flex flex-wrap gap-2">
                  {items.map((item, itemIndex) => (
                    <span key={itemIndex} className="px-4 py-2 bg-gray-200 rounded-lg shadow-md transition duration-200 hover:bg-secondary text-black">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : Array.isArray(resumeData[activeSection]) ? (
          <ul>
            {resumeData[activeSection].map((item, index) => (
              <li key={index} className="mb-4">
                {typeof item === "string" ? (
                  <p className="text-lg">{item}</p>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    {item.role && <p className="text-sm text-gray-600">{item.role} ({item.duration})</p>}
                    <p className="mt-2">{item.description}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="whitespace-pre-wrap text-lg">{resumeData[activeSection]}</p>
        )}
      </div>
    </div>
  );
}
