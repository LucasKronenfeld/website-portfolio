import { motion } from 'framer-motion';
import { useState } from 'react';

export default function BentoGrid({ items }) {
  const [selectedImage, setSelectedImage] = useState(null);

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

  // Create a Pinterest-style layout pattern
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
    <>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[150px] sm:auto-rows-[200px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          <motion.div
            key={`${item.title}-${index}`}
            className={`group relative overflow-hidden rounded-lg border border-white/10 cursor-pointer hover:border-primary/50 transition-colors ${getGridClass(index)}`}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedImage(item)}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
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

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            className="relative max-w-7xl max-h-[90vh] w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors text-lg font-semibold"
            >
              Close ✕
            </button>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="w-full h-full object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-sm sm:text-base text-gray-300">{selectedImage.description}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
