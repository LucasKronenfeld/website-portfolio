import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative h-[90vh] flex items-center justify-center text-center overflow-hidden bg-[#f5f5f7]">
      <div className="relative z-10 p-6">
        <motion.h1 
          className="text-6xl md:text-8xl font-bold text-gray-800 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          Lucas Gray
        </motion.h1>
        <motion.p 
          className="mt-4 text-xl md:text-2xl text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
        >
          Full-Stack Developer & Creative Technologist
        </motion.p>
        <motion.button 
          className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => document.getElementById('featured-work').scrollIntoView({ behavior: 'smooth' })}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
        >
          View My Work
        </motion.button>
      </div>
    </div>
  );
};

export default Hero;
