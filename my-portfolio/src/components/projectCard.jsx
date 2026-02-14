import { motion } from 'framer-motion';
import { normalizeExternalUrl } from '../utils/normalizeExternalUrl';

const ProjectCard = ({ imageSrc, title, description, link }) => {
  const safeLink = normalizeExternalUrl(link);
  return (
    <motion.a
      href={safeLink}
      target="_blank"
      rel="noopener noreferrer"
      className="relative w-full h-full rounded-lg overflow-hidden shadow-lg group block"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <img src={imageSrc} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm opacity-80">{description}</p>
        <span className="text-sm font-semibold mt-2 inline-block opacity-90 group-hover:opacity-100 transition-opacity">
          Inspect &rarr;
        </span>
      </div>
    </motion.a>
  );
};

export default ProjectCard;
