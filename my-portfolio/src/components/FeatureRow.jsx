import { motion } from 'framer-motion';

export default function FeatureRow({ item, index }) {
  const isReversed = index % 2 !== 0;

  // Animation for the container to trigger when it comes into view
  const containerVariants = {
    offscreen: { opacity: 0 },
    onscreen: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2 // This will make the image and text animate in one after the other
      }
    }
  };

  // Separate animations for the text and image for a more dynamic feel
  const textVariants = {
    offscreen: { x: isReversed ? 50 : -50, opacity: 0 },
    onscreen: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, duration: 0.8 }
    }
  };

  const imageVariants = {
    offscreen: { x: isReversed ? -50 : 50, opacity: 0 },
    onscreen: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, duration: 0.8 }
    }
  };

  return (
    <motion.div
      className={`flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-12 py-8 sm:py-12`}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the element is visible
      variants={containerVariants}
    >
      <motion.div className={`w-full md:w-1/2 ${isReversed ? 'md:order-last' : ''}`} variants={imageVariants}>
        <img 
          src={item.imageUrl || item.imageSrc} 
          alt={item.title} 
          className="w-full h-auto object-cover rounded-lg shadow-2xl max-h-[300px] sm:max-h-[400px] md:max-h-none" 
        />
      </motion.div>

      <motion.div className="w-full md:w-1/2 px-4 sm:px-0" variants={textVariants}>
        <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4">{item.title}</h3>
        <p className="text-base sm:text-lg text-muted mb-4 sm:mb-6 leading-relaxed">{item.description}</p>
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 sm:px-5 py-2 bg-secondary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all text-sm sm:text-base"
          >
            Inspect Project &rarr;
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}
