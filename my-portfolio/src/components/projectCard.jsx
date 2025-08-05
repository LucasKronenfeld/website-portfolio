const ProjectCard = ({ imageSrc, title, description, link }) => {
  return (
    <div className="bg-surface rounded-2xl shadow-lg overflow-hidden flex flex-col h-full border border-white/10">
      {/* Image */}
      <div className="w-full h-48 overflow-hidden">
        <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
      </div>
      
      {/* Content */}
      <div className="p-4 flex-grow">
        <h3 className="text-xl font-semibold text-text">{title}</h3>
        <p className="text-muted mt-2">{description}</p>
      </div>

      {/* Button */}
      <div className="p-4 pt-0">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block text-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-80 transition-all"
        >
          Inspect
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
