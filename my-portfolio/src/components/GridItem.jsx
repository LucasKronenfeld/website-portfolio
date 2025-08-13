import { motion } from 'framer-motion';

const GridItem = ({ imageUrl, title, description, link }) => {
  return (
    <motion.a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 text-base">{description}</p>
      </div>
    </motion.a>
  );
};

export default GridItem;
