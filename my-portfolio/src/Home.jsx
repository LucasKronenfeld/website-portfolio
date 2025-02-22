import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text px-6 py-12">
      {/* Top Section (Mobile: Column, Desktop: Row) */}
      <div className="flex flex-col md:flex-row items-center w-full max-w-4xl mb-16 gap-6">
        {/* SVG Image */}
        <motion.img
          src="/deskWorks.svg"
          alt="Creative SVG"
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.1, filter: "drop-shadow(0px 0px 15px #BF996B)" }}
        />

        {/* Text Section */}
        <motion.div
          className="text-center md:text-left md:ml-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-2xl sm:text-3xl font-bold"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Welcome to My Digital Space
          </motion.h1>
          <motion.p
            className="mt-2 text-base sm:text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            "I’m Lucas Kronenfeld, a passionate problem solver, creator, and Computer Engineering student. 
            This site is a reflection of my journey—blending technical expertise, creative expression, and 
            personal projects. Explore my work, and let’s build something amazing together."
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom Section (Mobile: Column, Desktop: Row) */}
      <div className="flex flex-col-reverse md:flex-row items-center w-full max-w-4xl gap-6">
        {/* Text Section */}
        <motion.div
          className="text-center md:text-right md:mr-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-2xl sm:text-3xl font-bold"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Designed for Innovation
          </motion.h1>
          <motion.p
            className="mt-2 text-base sm:text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            "This website is more than a portfolio—it's a dynamic space built with React, Vite, and JavaScript. 
            Every hover, transition, and animation is a small glimpse into my approach: blending efficiency, 
            aesthetics, and interactivity. Take a look around!"
          </motion.p>
        </motion.div>

        {/* SVG Image */}
        <motion.img
          src="/computerScreen.svg"
          alt="Innovative SVG"
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          whileHover={{ rotate: 360, filter: "drop-shadow(0px 0px 15px #8F9FA6)" }}
        />
      </div>
    </div>
  );
};

export default Home;
