import { motion } from 'framer-motion';

// Define variants for the parent to control
export const featureRowVariants = {
  offscreen: { opacity: 0, y: 20 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      duration: 0.3
    }
  }
};

export default function FeatureRow({ item, index }) {
  const isReversed = index % 2 !== 0;

  return (
    <motion.div
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 py-12`}
      variants={featureRowVariants}
    >
      {/* Image Section */}
      <div className={`w-full md:w-1/2 ${isReversed ? 'md:order-last' : ''}`}>
        <img src={item.imageUrl || item.imageSrc} alt={item.title} className="w-full h-auto object-cover rounded-lg shadow-2xl" />
      </div>

      {/* Text Section */}
      <div className="w-full md:w-1/2">
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
      </div>
    </motion.div>
  );
}
