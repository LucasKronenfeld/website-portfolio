import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from '@heroicons/react/24/outline';

const Card = ({ imageSrc, title, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        onClick={() => setIsOpen(true)}
        className="relative w-full h-full rounded-lg overflow-hidden shadow-lg group cursor-pointer"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <img src={imageSrc} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm opacity-80">{description}</p>
        </div>
      </motion.div>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-[1000] p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-opacity-80 transition-colors z-20"
              >
                <XMarkIcon className="w-8 h-8" />
              </button>
              <motion.div
                className="relative max-w-4xl max-h-[90vh]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img src={imageSrc} alt={title} className="w-full h-full object-contain rounded-lg shadow-2xl" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Card;
