import { motion } from 'framer-motion';

export default function FeatureRow({ item, index }) {
  // Alternate layout based on the item's index (even/odd)
  const isReversed = index % 2 !== 0;

  // Animation variants for the text and image
  const textVariants = {
    offscreen: { x: isReversed ? 50 : -50, opacity: 0 },
    onscreen: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 40, duration: 0.8 }
    }
  };

  const imageVariants = {
    offscreen: { scale: 0.9, opacity: 0 },
    onscreen: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 40, duration: 0.8 }
    }
  };

  return (
    <motion.div
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 py-12`}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.4 }}
    >
      {/* Image Section */}
      <motion.div className={`w-full md:w-1/2 ${isReversed ? 'md:order-last' : ''}`} variants={imageVariants}>
        <img src={item.imageUrl || item.imageSrc} alt={item.title} className="w-full h-auto object-cover rounded-lg shadow-2xl" />
      </motion.div>

      {/* Text Section */}
      <motion.div className="w-full md:w-1/2" variants={textVariants}>
        <h3 className="text-3xl font-bold text-primary mb-4">{item.title}</h3>
        <p className="text-lg text-muted mb-6">{item.description}</p>
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 bg-secondary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all text-sm"
          >
            Inspect Project &rarr;
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}
