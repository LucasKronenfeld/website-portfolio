import { motion } from 'framer-motion';

const FeatureRow = ({ title, description, features }) => {
  return (
    <div className="text-white">
      <motion.h2 
        className="text-3xl font-bold mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      <motion.p 
        className="text-gray-300 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {description}
      </motion.p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features && features.map((feature, index) => (
          <motion.div 
            key={index}
            className="bg-white/10 p-4 rounded-lg border border-white/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
          >
            <h3 className="font-semibold text-lg mb-2">{feature.name}</h3>
            <p className="text-gray-400 text-sm">{feature.details}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeatureRow;
