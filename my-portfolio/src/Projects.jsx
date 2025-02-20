import { useState } from "react";
import ProjectCard from "./components/projectCard";

export default function Projects() {
  const [activeTab, setActiveTab] = useState("Computer Science");

  const projects = {
    "Computer Science": [
      { imageSrc: "csProject1.png", title: "CS Project 1", description: "A computer science project", link: "https://example.com/cs1" },
      { imageSrc: "csProject2.png", title: "CS Project 2", description: "Another CS project", link: "https://example.com/cs2" },
    ],
    "In Progress": [
      { imageSrc: "progressProject1.png", title: "In Progress 1", description: "A project currently in development", link: "https://example.com/progress1" },
      { imageSrc: "progressProject2.png", title: "In Progress 2", description: "Another work in progress", link: "https://example.com/progress2" },
    ],
    "Personal": [
      { imageSrc: "personalProject1.png", title: "Personal Project 1", description: "A personal passion project", link: "https://example.com/personal1" },
      { imageSrc: "personalProject2.png", title: "Personal Project 2", description: "Another personal project", link: "https://example.com/personal2" },
    ],
  };

  return (
    <div className="min-h-screen bg-background rounded-lg p-8">
      <div className="max-w-screen-2xl mx-auto p-4 relative">
        {/* Projects Title */}
        <h1 className="text-4xl font-bold text-text text-center mb-8">Projects</h1>

        {/* Intro Paragraph */}
        <p className="text-text text-lg mb-6 text-center">
          Explore my projects, including computer science work, ongoing developments, and personal creations. Click "Inspect" to view more details.
        </p>

        {/* Tabs Bar - Chrome-Style */}
        <div className="relative w-full flex border-4 border-contrast border-b-0 rounded-t-lg bg-contrast">
          {Object.keys(projects).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition relative rounded-t-lg 
                before:absolute before:bottom-0 before:left-0 before:w-full before:h-1 
                ${
                  activeTab === tab 
                    ? "bg-background text-text before:bg-secondary border-b-0 rounded-b-none" 
                    : "bg-contrast text-white before:bg-transparent"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Section with Border */}
        <div className="border-4 border-contrast border-t-0 rounded-b-lg p-4 bg-background">
          {/* Cards Grid - Limited to 3 Cards Per Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {projects[activeTab].map((project, index) => (
              <ProjectCard key={index} imageSrc={project.imageSrc} title={project.title} description={project.description} link={project.link} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
