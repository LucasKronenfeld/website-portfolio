import { motion } from 'framer-motion';

export default function BentoGrid({ items }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  // Create a bento box pattern with varied sizes
  const getGridClass = (index) => {
    const patterns = [
      'row-span-2', // tall
      'col-span-2', // wide
      '', // regular
      'row-span-2', // tall
      '', // regular
      'col-span-2 row-span-2', // large
      '', // regular
      'row-span-2', // tall
      '', // regular
      'col-span-2', // wide
    ];
    return patterns[index % patterns.length];
  };

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[200px] sm:auto-rows-[250px] lg:auto-rows-[300px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.div
          key={`${item.title}-${index}`}
          className={`group relative overflow-hidden rounded-lg border border-white/10 bg-surface/50 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 hover:z-10 ${getGridClass(index)}`}
          variants={itemVariants}
        >
          <div className="w-full h-full flex items-center justify-center p-2">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="max-w-full max-h-full object-contain transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4">
            <div className="w-full">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-1">{item.title}</h3>
              {item.description && (
                <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">{item.description}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
