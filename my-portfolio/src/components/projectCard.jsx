const ProjectCard = ({ imageSrc, title, description, link }) => {
    return (
      <div className="bg-background rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
        {/* Image */}
        <img src={imageSrc} alt={title} className="w-full h-48 object-cover" />
        
        {/* Content */}
        <div className="p-4 flex-grow">
          <h3 className="text-xl font-semibold text-text">{title}</h3>
          <p className="text-contrast mt-2">{description}</p>
  
          {/* Button */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-contrast transition inline-block text-center"
          >
            Inspect
          </a>
        </div>
      </div>
    );
  };
  
  export default ProjectCard;
  